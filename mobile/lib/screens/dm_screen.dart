import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../theme/app_theme.dart';

class DMScreen extends StatefulWidget {
  final int targetUserId;
  final String targetUserName;

  const DMScreen({super.key, required this.targetUserId, required this.targetUserName});

  @override
  State<DMScreen> createState() => _DMScreenState();
}

class _DMScreenState extends State<DMScreen> {
  late IO.Socket socket;
  List<dynamic> messages = [];
  final TextEditingController _messageController = TextEditingController();
  final int currentUserId = 1; // Assuming Esma is logged in
  String? roomId;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _connectSocket();
  }

  void _connectSocket() {
    socket = IO.io('http://10.0.2.2:5000', IO.OptionBuilder()
      .setTransports(['websocket'])
      .disableAutoConnect()
      .build());

    socket.connect();

    socket.onConnect((_) {
      print('Connected to Socket');
      socket.emit('join_dm', {
        'user1Id': currentUserId,
        'user2Id': widget.targetUserId,
      });
    });

    socket.on('dm_room_joined', (room) {
      if (mounted) {
        setState(() {
          roomId = room['id'].toString();
        });
        _fetchMessages(roomId!);
      }
    });

    socket.on('receive_message', (msg) {
      if (mounted) {
        setState(() {
          bool exists = messages.any((m) => m['id'] == msg['id']);
          if (!exists) {
            messages.add(msg);
          }
        });
        _scrollToBottom();
      }
    });
  }

  Future<void> _fetchMessages(String rId) async {
    try {
      final res = await http.get(Uri.parse('http://10.0.2.2:5000/api/dm/$rId/messages'));
      if (res.statusCode == 200) {
        setState(() {
          messages = json.decode(res.body);
        });
        _scrollToBottom();
      }
    } catch (e) {
      print('Fetch messages error: $e');
    }
  }

  void _sendMessage() {
    final text = _messageController.text.trim();
    if (text.isEmpty || roomId == null) return;

    socket.emit('send_message', {
      'roomId': roomId,
      'senderId': currentUserId,
      'content': text,
    });

    _messageController.clear();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    socket.disconnect();
    socket.dispose();
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: const Color(0xFF12121A),
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: Theme.of(context).primaryColor.withOpacity(0.2),
              child: Text(
                widget.targetUserName[0].toUpperCase(),
                style: TextStyle(color: Theme.of(context).primaryColor, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(width: 12),
            Text(widget.targetUserName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: const AssetImage('assets/images/noise.png'),
                  repeat: ImageRepeat.repeat,
                  opacity: 0.5,
                ),
              ),
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.all(16),
                itemCount: messages.length,
                itemBuilder: (context, index) {
                  final msg = messages[index];
                  final isMe = msg['senderId'] == currentUserId;

                  return Align(
                    alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: isMe ? Theme.of(context).primaryColor : const Color(0xFF1E1E2A),
                        borderRadius: BorderRadius.only(
                          topLeft: const Radius.circular(16),
                          topRight: const Radius.circular(16),
                          bottomLeft: Radius.circular(isMe ? 16 : 4),
                          bottomRight: Radius.circular(isMe ? 4 : 16),
                        ),
                        boxShadow: isMe ? AppTheme.getGlow(Theme.of(context).primaryColor, blur: 5) : [],
                      ),
                      child: Text(
                        msg['content'] ?? '',
                        style: TextStyle(
                          color: isMe ? Colors.black : Colors.white,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              color: Color(0xFF12121A),
              border: Border(top: BorderSide(color: Colors.white10)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Mesaj yaz...',
                      hintStyle: const TextStyle(color: Colors.white30),
                      filled: true,
                      fillColor: Colors.black,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide: const BorderSide(color: Colors.white24),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide: BorderSide(color: Theme.of(context).primaryColor),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: _sendMessage,
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Theme.of(context).primaryColor,
                      shape: BoxShape.circle,
                      boxShadow: AppTheme.getGlow(Theme.of(context).primaryColor, blur: 8),
                    ),
                    child: const Icon(Icons.send, color: Colors.black, size: 20),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
