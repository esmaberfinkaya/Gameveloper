import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../theme/app_theme.dart';
import 'dm_screen.dart';

class InboxScreen extends StatefulWidget {
  const InboxScreen({super.key});

  @override
  State<InboxScreen> createState() => _InboxScreenState();
}

class _InboxScreenState extends State<InboxScreen> {
  List<dynamic> rooms = [];
  bool isLoading = true;
  int? currentUserId;

  @override
  void initState() {
    super.initState();
    _loadUserAndRooms();
  }

  Future<void> _loadUserAndRooms() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('user');
    if (userStr != null) {
      final user = json.decode(userStr);
      currentUserId = user['id'];
      await _fetchRooms();
    } else {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> _fetchRooms() async {
    if (currentUserId == null) return;
    try {
      final res = await http.get(Uri.parse('http://10.0.2.2:5000/api/dm/rooms/$currentUserId'));
      if (res.statusCode == 200) {
        if (mounted) {
          setState(() {
            rooms = json.decode(res.body);
            isLoading = false;
          });
        }
      }
    } catch (e) {
      print('Fetch rooms error: $e');
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: const Color(0xFF12121A),
        title: const Text('Mesajlar', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2)),
        centerTitle: true,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.neonCyan))
          : rooms.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.message_outlined, size: 64, color: Colors.white24),
                      const SizedBox(height: 16),
                      const Text(
                        'Henüz mesajınız yok',
                        style: TextStyle(color: Colors.white54, fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  itemCount: rooms.length,
                  itemBuilder: (context, index) {
                    final room = rooms[index];
                    final isUser1 = room['user1Id'] == currentUserId;
                    final otherUser = isUser1 ? room['user2'] : room['user1'];
                    
                    final messages = room['messages'] as List<dynamic>?;
                    final latestMessage = (messages != null && messages.isNotEmpty) 
                        ? messages[0]['content'] 
                        : 'Mesajlaşmaya başla...';

                    return ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      tileColor: const Color(0xFF12121A),
                      leading: CircleAvatar(
                        radius: 28,
                        backgroundColor: AppTheme.neonCyan.withOpacity(0.1),
                        child: Text(
                          otherUser['name'][0].toUpperCase(),
                          style: const TextStyle(color: AppTheme.neonCyan, fontWeight: FontWeight.bold, fontSize: 20),
                        ),
                      ),
                      title: Text(
                        otherUser['name'],
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text(
                        latestMessage,
                        style: const TextStyle(color: Colors.white54),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => DMScreen(
                              targetUserId: otherUser['id'],
                              targetUserName: otherUser['name'],
                            ),
                          ),
                        ).then((_) => _fetchRooms()); // Refresh when coming back
                      },
                    );
                  },
                ),
    );
  }
}
