import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:image_picker/image_picker.dart';
import '../theme/app_theme.dart';

class ProjectShareBottomSheet extends StatefulWidget {
  final int userId;
  final VoidCallback onSuccess;

  const ProjectShareBottomSheet({super.key, required this.userId, required this.onSuccess});

  @override
  State<ProjectShareBottomSheet> createState() => _ProjectShareBottomSheetState();
}

class _ProjectShareBottomSheetState extends State<ProjectShareBottomSheet> {
  final _titleController = TextEditingController();
  final _summaryController = TextEditingController();
  final _youtubeUrlController = TextEditingController();
  final _storeUrlController = TextEditingController();
  String? _base64Image;
  bool _isSubmitting = false;

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery, imageQuality: 50);
    
    if (pickedFile != null) {
      final bytes = await pickedFile.readAsBytes();
      if (bytes.length > 2 * 1024 * 1024) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Dosya boyutu 2MB\'den küçük olmalıdır.')));
        return;
      }
      setState(() {
        _base64Image = 'data:image/jpeg;base64,' + base64Encode(bytes);
      });
    }
  }

  Future<void> _submit() async {
    if (_titleController.text.isEmpty || _summaryController.text.isEmpty || _base64Image == null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lütfen zorunlu alanları (Başlık, Özet, Görsel) doldurun.')));
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final res = await http.post(
        Uri.parse('http://10.0.2.2:5000/api/projects'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'userId': widget.userId,
          'title': _titleController.text,
          'summary': _summaryController.text,
          'youtubeUrl': _youtubeUrlController.text,
          'storeUrl': _storeUrlController.text,
          'images': _base64Image,
        }),
      );

      if (res.statusCode == 200 || res.statusCode == 201) {
        widget.onSuccess();
        if (mounted) Navigator.pop(context);
      } else {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Hata oluştu.')));
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Bağlantı hatası: $e')));
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0A0A0F),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        border: Border.all(color: Theme.of(context).primaryColor.withOpacity(0.5)),
      ),
      padding: EdgeInsets.only(
        top: 24,
        left: 20,
        right: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('PROJE PAYLAŞ', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900, letterSpacing: 2)),
                IconButton(icon: const Icon(Icons.close, color: Colors.white54), onPressed: () => Navigator.pop(context)),
              ],
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _titleController,
              style: const TextStyle(color: Colors.white),
              decoration: _inputDecoration('Proje Adı'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _summaryController,
              style: const TextStyle(color: Colors.white),
              maxLines: 3,
              decoration: _inputDecoration('Ana Fikir Özeti'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _youtubeUrlController,
              style: const TextStyle(color: Colors.white),
              decoration: _inputDecoration('YouTube Linki'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _storeUrlController,
              style: const TextStyle(color: Colors.white),
              decoration: _inputDecoration('Mağaza Linki'),
            ),
            const SizedBox(height: 16),
            GestureDetector(
              onTap: _pickImage,
              child: Container(
                height: 120,
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.white24, style: BorderStyle.solid),
                  borderRadius: BorderRadius.circular(12),
                  image: _base64Image != null ? DecorationImage(
                    image: MemoryImage(base64Decode(_base64Image!.split(',').last)),
                    fit: BoxFit.cover,
                  ) : null,
                ),
                child: _base64Image == null ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.upload_file, color: Colors.white54, size: 32),
                      SizedBox(height: 8),
                      Text('Proje Görseli Yükle', style: TextStyle(color: Colors.white54)),
                    ],
                  ),
                ) : null,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isSubmitting ? null : _submit,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: _isSubmitting 
                ? const CircularProgressIndicator(color: Colors.black)
                : const Text('PROJEYİ YAYINLA', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, letterSpacing: 2)),
            ),
          ],
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Colors.white54),
      filled: true,
      fillColor: const Color(0xFF12121A),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.white12)),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Theme.of(context).primaryColor)),
    );
  }
}
