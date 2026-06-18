import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../theme/app_theme.dart';
import '../widgets/cyber_card.dart';

class PartnershipScreen extends StatefulWidget {
  const PartnershipScreen({super.key});

  @override
  State<PartnershipScreen> createState() => _PartnershipScreenState();
}

class _PartnershipScreenState extends State<PartnershipScreen> {
  List<dynamic> partnerships = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchPartnerships();
  }

  Future<void> fetchPartnerships() async {
    try {
      final res = await http.get(Uri.parse('http://10.0.2.2:5000/api/partnerships'));
      if (res.statusCode == 200) {
        setState(() {
          partnerships = json.decode(res.body);
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() => isLoading = false);
    }
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('BOUNTY BOARD'),
        leading: Icon(Icons.group_add),
        actions: [
          IconButton(
            icon: Icon(Icons.sort, color: Theme.of(context).primaryColor),
            onPressed: () {},
          )
        ],
      ),
      body: isLoading 
        ? Center(child: CircularProgressIndicator(color: Theme.of(context).primaryColor))
        : ListView.builder(
        padding: EdgeInsets.all(16.0),
        itemCount: partnerships.length,
        itemBuilder: (context, index) {
          final item = partnerships[index];
          final isUrgent = item['isUrgent'] as bool;

          return CyberCard(
            glowColor: Theme.of(context).primaryColor,
            hasGlow: true,
            borderWidth: 2,
            padding: EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header: Required Role Badge & Urgent Tag
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Theme.of(context).primaryColor.withOpacity(0.1),
                        border: Border.all(color: Theme.of(context).primaryColor),
                        borderRadius: BorderRadius.circular(4),
                        boxShadow: AppTheme.getGlow(Theme.of(context).primaryColor, blur: 10),
                      ),
                      child: Text(
                        item['requiredRole'],
                        style: TextStyle(
                          color: Theme.of(context).primaryColor,
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 2.0,
                        ),
                      ),
                    ),
                    if (isUrgent)
                      Row(
                        children: [
                          Icon(Icons.local_fire_department, color: Colors.deepOrangeAccent, size: 16),
                          SizedBox(width: 4),
                          Text(
                            'URGENT',
                            style: TextStyle(
                              color: Colors.deepOrangeAccent,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ],
                      ),
                  ],
                ),
                SizedBox(height: 16),
                
                // Title
                Text(
                  item['title'],
                  style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.0,
                  ),
                ),
                SizedBox(height: 12),
                
                // Description
                Text(
                  item['description'],
                  style: TextStyle(
                    color: AppTheme.textSecondary,
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
                SizedBox(height: 24),
                
                // Footer: Trust Score & Apply Button
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    // Trust Score Box
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              radius: 10,
                              backgroundColor: Colors.white10,
                              child: Text(
                                item['user']?['name']?[0]?.toUpperCase() ?? 'U',
                                style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                              ),
                            ),
                            SizedBox(width: 6),
                            Text(
                              item['user']?['name'] ?? 'Bilinmiyor',
                              style: TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                          ],
                        ),
                        SizedBox(height: 8),
                        Row(
                          children: [
                            Icon(Icons.bolt, color: Theme.of(context).primaryColor, size: 16),
                            SizedBox(width: 4),
                            Text(
                              'Trust Score: ${item['user']?['trustScore'] ?? 0}',
                              style: TextStyle(
                                color: Theme.of(context).primaryColor,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    
                    // Apply Button
                    ElevatedButton(
                      onPressed: () => _showChatBottomSheet(context, item),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).primaryColor.withOpacity(0.2),
                        foregroundColor: Theme.of(context).primaryColor,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          side: BorderSide(color: Theme.of(context).primaryColor, width: 2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      ),
                      child: Text(
                        'BAŞVUR',
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          letterSpacing: 2.0,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: Theme.of(context).primaryColor.withOpacity(0.2),
        elevation: 0,
        shape: RoundedRectangleBorder(
          side: BorderSide(color: Theme.of(context).primaryColor, width: 2),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Icon(Icons.add, color: Theme.of(context).primaryColor),
      ),
    );
  }

  void _showChatBottomSheet(BuildContext context, dynamic item) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return ChatBottomSheet(item: item);
      },
    );
  }
}

class ChatBottomSheet extends StatefulWidget {
  final dynamic item;
  const ChatBottomSheet({Key? key, required this.item}) : super(key: key);

  @override
  _ChatBottomSheetState createState() => _ChatBottomSheetState();
}

class _ChatBottomSheetState extends State<ChatBottomSheet> {
  IO.Socket? socket;
  List<dynamic> messages = [];
  final TextEditingController _messageController = TextEditingController();
  int userId = 1;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _initChat();
  }

  void _initChat() async {
    final prefs = await SharedPreferences.getInstance();
    userId = prefs.getInt('userId') ?? 1;

    try {
      final res = await http.get(Uri.parse('http://10.0.2.2:5000/api/partnerships/${widget.item['id']}/messages'));
      if (res.statusCode == 200) {
        setState(() {
          messages = json.decode(res.body);
        });
        _scrollToBottom();
      }
    } catch (e) {
      print(e);
    }

    socket = IO.io('http://10.0.2.2:5000', IO.OptionBuilder()
      .setTransports(['websocket'])
      .disableAutoConnect()
      .build()
    );
    socket!.connect();
    socket!.onConnect((_) {
      socket!.emit('join_room', widget.item['id']);
    });
    socket!.on('receive_message', (data) {
      if (mounted) {
        setState(() {
          messages.add(data);
        });
        _scrollToBottom();
      }
    });
  }

  void _scrollToBottom() {
    Future.delayed(Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;
    
    socket!.emit('send_message', {
      'partnershipId': widget.item['id'],
      'senderId': userId,
      'content': _messageController.text.trim(),
    });
    
    _messageController.clear();
  }

  @override
  void dispose() {
    socket?.disconnect();
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.85,
          decoration: BoxDecoration(
            color: const Color(0xFF05070A),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            border: Border(
              top: BorderSide(color: Theme.of(context).primaryColor, width: 2),
            ),
            boxShadow: [
              BoxShadow(
                color: Theme.of(context).primaryColor.withOpacity(0.2),
                blurRadius: 30,
                spreadRadius: 5,
              ),
            ],
          ),
          child: Column(
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  border: Border(bottom: BorderSide(color: Theme.of(context).primaryColor.withOpacity(0.5))),
                  color: const Color(0xFF0D1117),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: Theme.of(context).primaryColor.withOpacity(0.2),
                            border: Border.all(color: Theme.of(context).primaryColor),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Center(
                            child: Text(
                              widget.item['user']?['name']?[0]?.toUpperCase() ?? 'U',
                              style: TextStyle(color: Theme.of(context).primaryColor, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(widget.item['user']?['name'] ?? 'Bilinmiyor', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                            Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: BoxDecoration(
                                    color: Theme.of(context).primaryColor,
                                    shape: BoxShape.circle,
                                    boxShadow: [BoxShadow(color: Theme.of(context).primaryColor, blurRadius: 5)],
                                  ),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  'ONLINE',
                                  style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 10, letterSpacing: 2),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white54),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),
              // Chat Area
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      const Text(
                        '< SECURE CONNECTION ESTABLISHED >',
                        style: TextStyle(color: Colors.white30, fontSize: 10, fontFamily: 'monospace'),
                      ),
                      const SizedBox(height: 16),
                      if (messages.isEmpty)
                        const Center(child: Text('Hiç mesaj yok. İlk yazan sen ol!', style: TextStyle(color: Colors.white54, fontSize: 12))),
                        
                      Expanded(
                        child: ListView.builder(
                          controller: _scrollController,
                          itemCount: messages.length,
                          itemBuilder: (context, index) {
                            final m = messages[index];
                            final isMe = m['senderId'] == userId;
                            
                            return Align(
                              alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                              child: Container(
                                margin: EdgeInsets.only(
                                  left: isMe ? 50 : 0, 
                                  right: isMe ? 0 : 50, 
                                  bottom: 16
                                ),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: isMe ? Theme.of(context).primaryColor.withOpacity(0.1) : Colors.white10,
                                  borderRadius: BorderRadius.only(
                                    topLeft: Radius.circular(16),
                                    topRight: Radius.circular(16),
                                    bottomLeft: Radius.circular(isMe ? 16 : 0),
                                    bottomRight: Radius.circular(isMe ? 0 : 16),
                                  ),
                                  border: Border(
                                    right: isMe ? BorderSide(color: Theme.of(context).primaryColor, width: 2) : BorderSide.none,
                                    left: !isMe ? const BorderSide(color: Colors.white30, width: 2) : BorderSide.none,
                                  ),
                                ),
                                child: Column(
                                  crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      m['sender']?['name'] ?? 'Kullanıcı',
                                      style: TextStyle(color: isMe ? Theme.of(context).primaryColor : Colors.white54, fontSize: 10),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      m['content'] ?? '',
                                      style: TextStyle(color: isMe ? Theme.of(context).primaryColor : Colors.white70, fontSize: 14),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // Input
              Container(
                padding: EdgeInsets.only(
                  left: 16, right: 16, top: 16,
                  bottom: MediaQuery.of(context).viewInsets.bottom + 16,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF0D1117),
                  border: Border(top: BorderSide(color: Theme.of(context).primaryColor.withOpacity(0.5))),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _messageController,
                        style: TextStyle(color: Theme.of(context).primaryColor, fontFamily: 'monospace', fontSize: 14),
                        onSubmitted: (_) => _sendMessage(),
                        decoration: InputDecoration(
                          hintText: 'Mesajını yaz terminale...',
                          hintStyle: TextStyle(color: Theme.of(context).primaryColor.withOpacity(0.5)),
                          filled: true,
                          fillColor: Colors.black,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(color: Colors.white24),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide(color: Theme.of(context).primaryColor),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: Theme.of(context).primaryColor,
                        borderRadius: BorderRadius.circular(8),
                        boxShadow: AppTheme.getGlow(Theme.of(context).primaryColor, blur: 10),
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.send, color: Colors.black),
                        onPressed: _sendMessage,
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
