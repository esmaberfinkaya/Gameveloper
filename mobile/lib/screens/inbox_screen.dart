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
  List<dynamic> searchResults = [];
  bool isLoading = true;
  bool isSearching = false;
  int? currentUserId;
  final TextEditingController _searchController = TextEditingController();

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

  Future<void> _searchUsers(String query) async {
    if (query.trim().isEmpty) {
      setState(() {
        searchResults = [];
        isSearching = false;
      });
      return;
    }
    
    setState(() => isSearching = true);
    try {
      final res = await http.get(Uri.parse('http://10.0.2.2:5000/api/users/search?q=\$query'));
      if (res.statusCode == 200) {
        final data = json.decode(res.body) as List<dynamic>;
        if (mounted) {
          setState(() {
            searchResults = data.where((u) => u['id'] != currentUserId).toList();
          });
        }
      }
    } catch (e) {
      print('Search error: $e');
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
          : Column(
              children: [
                // Search Bar
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: TextField(
                    controller: _searchController,
                    onChanged: _searchUsers,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Kullanıcı Ara...',
                      hintStyle: const TextStyle(color: Colors.white54),
                      prefixIcon: const Icon(Icons.search, color: AppTheme.neonCyan),
                      filled: true,
                      fillColor: const Color(0xFF12121A),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide: const BorderSide(color: Colors.white12),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide: const BorderSide(color: AppTheme.neonCyan),
                      ),
                      contentPadding: const EdgeInsets.symmetric(vertical: 0),
                    ),
                  ),
                ),
                
                // Content List
                Expanded(
                  child: isSearching
                      ? searchResults.isEmpty
                          ? const Center(child: Text('Kullanıcı bulunamadı.', style: TextStyle(color: Colors.white54)))
                          : ListView.builder(
                              itemCount: searchResults.length,
                              itemBuilder: (context, index) {
                                final user = searchResults[index];
                                return ListTile(
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                  tileColor: const Color(0xFF12121A),
                                  leading: CircleAvatar(
                                    radius: 28,
                                    backgroundColor: AppTheme.neonCyan.withOpacity(0.1),
                                    child: Text(
                                      user['name'][0].toUpperCase(),
                                      style: const TextStyle(color: AppTheme.neonCyan, fontWeight: FontWeight.bold, fontSize: 20),
                                    ),
                                  ),
                                  title: Text(
                                    user['name'],
                                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                  ),
                                  subtitle: Text(
                                    user['role'],
                                    style: const TextStyle(color: AppTheme.neonCyan, fontSize: 10, letterSpacing: 1.2),
                                  ),
                                  onTap: () {
                                    _searchController.clear();
                                    setState(() {
                                      isSearching = false;
                                      searchResults = [];
                                    });
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) => DMScreen(
                                          targetUserId: user['id'],
                                          targetUserName: user['name'],
                                        ),
                                      ),
                                    ).then((_) => _fetchRooms());
                                  },
                                );
                              },
                            )
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
                                    ).then((_) => _fetchRooms());
                                  },
                                );
                              },
                            ),
                ),
              ],
            ),
    );
  }
}
