import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import '../providers/evaluation_provider.dart';
import '../models/models.dart';
import 'thank_you_screen.dart';

class EvaluationWizardScreen extends StatefulWidget {
  const EvaluationWizardScreen({super.key});

  @override
  State<EvaluationWizardScreen> createState() => _EvaluationWizardScreenState();
}

class _EvaluationWizardScreenState extends State<EvaluationWizardScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  // ============ BẢNG MÀU NUTRIHEALTH ============
  static const Color nhBlue = Color(0xFF2196F3);
  static const Color nhBlueDark = Color(0xFF1976D2);
  static const Color nhBlueLight = Color(0xFF42A5F5);
  static const Color nhGreen = Color(0xFF66BB6A);
  static const Color nhGreenDark = Color(0xFF43A047);

  final Map<int, TextEditingController> _commentControllers = {};

  TextEditingController _getCommentController(int categoryId) {
    if (!_commentControllers.containsKey(categoryId)) {
      final provider = Provider.of<EvaluationProvider>(context, listen: false);
      _commentControllers[categoryId] = TextEditingController(
        text: provider.comments[categoryId] ?? '',
      );
    }
    return _commentControllers[categoryId]!;
  }

  @override
  void dispose() {
    _pageController.dispose();
    for (var c in _commentControllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  void _nextPage(int totalPages) {
    if (_currentPage < totalPages - 1) {
      _pageController.nextPage(duration: const Duration(milliseconds: 400), curve: Curves.easeInOut);
    } else {
      _finishEvaluation();
    }
  }

  void _prevPage() {
    if (_currentPage > 0) {
      _pageController.previousPage(duration: const Duration(milliseconds: 400), curve: Curves.easeInOut);
    }
  }

  void _finishEvaluation() async {
    FocusScope.of(context).unfocus();
    final provider = Provider.of<EvaluationProvider>(context, listen: false);

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: const Padding(
          padding: EdgeInsets.symmetric(vertical: 20, horizontal: 28),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(color: nhBlue, strokeWidth: 3),
              SizedBox(width: 20),
              Text('Đang gửi đánh giá...', style: TextStyle(fontSize: 17)),
            ],
          ),
        ),
      ),
    );

    final success = await provider.submit();
    if (mounted) Navigator.pop(context);

    if (success) {
      if (mounted) {
        Navigator.pushAndRemoveUntil(
          context, MaterialPageRoute(builder: (_) => const ThankYouScreen()), (route) => false,
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: const Text('Có lỗi xảy ra, vui lòng thử lại.'), backgroundColor: Colors.red.shade600),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<EvaluationProvider>(context);
    final categories = provider.categories;
    final config = provider.appConfig;
    final totalPages = categories.length;

    if (categories.isEmpty) {
      return const Scaffold(body: Center(child: Text('Không có dữ liệu tiêu chí.', style: TextStyle(fontSize: 20))));
    }

    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: const Color(0xFFF0F4F8),
        body: SafeArea(
          child: Column(
            children: [
              // ===== HEADER: Logo + Progress =====
              _buildHeader(totalPages),

              // ===== MAIN CONTENT =====
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  physics: const NeverScrollableScrollPhysics(),
                  onPageChanged: (page) {
                    FocusScope.of(context).unfocus();
                    setState(() => _currentPage = page);
                  },
                  itemCount: totalPages,
                  itemBuilder: (context, index) => _buildCategoryPage(categories[index]),
                ),
              ),

              // ===== FOOTER: Back + Hotline + Next =====
              _buildFooter(config, totalPages, provider),
            ],
          ),
        ),
      ),
    );
  }

  // Header gọn nhất có thể: Logo + Progress bar + Bước X/Y
  Widget _buildHeader(int totalPages) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), offset: const Offset(0, 1), blurRadius: 4)],
      ),
      child: Row(
        children: [
          Image.asset('assets/logo.png', height: 50,
            errorBuilder: (_, __, ___) => const Icon(Icons.eco_rounded, color: nhGreen, size: 30),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Row(
              children: List.generate(totalPages, (index) {
                return Expanded(
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 2),
                    height: 5,
                    decoration: BoxDecoration(
                      color: index < _currentPage ? nhGreen : index == _currentPage ? nhBlue : Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                );
              }),
            ),
          ),
          const SizedBox(width: 12),
          Text('Bước ${_currentPage + 1}/$totalPages',
            style: const TextStyle(color: nhBlueDark, fontWeight: FontWeight.bold, fontSize: 18),
          ),
        ],
      ),
    );
  }

  // Footer: Back | Hotline | Next/Hoàn tất
  Widget _buildFooter(AppConfigModel? config, int totalPages, EvaluationProvider provider) {
    final currentCategory = provider.categories.isNotEmpty ? provider.categories[_currentPage] : null;
    final currentScore = currentCategory != null ? (provider.ratings[currentCategory.id] ?? 0) : 0;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), offset: const Offset(0, -1), blurRadius: 4)],
      ),
      child: Row(
        children: [
          // Nút BACK
          if (_currentPage > 0)
            TextButton.icon(
              onPressed: _prevPage,
              icon: const Icon(Icons.arrow_back_rounded, size: 18),
              label: const Text('Quay lại', style: TextStyle(fontSize: 14)),
               style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              disabledBackgroundColor: Colors.grey.shade300,
              padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 10),
              minimumSize: Size.zero,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              elevation: 1,
            ),
            )
          else
            const SizedBox(width: 110),

          // Hotline (giữa)
          Expanded(
            child: Center(
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.phone_rounded, color: Colors.grey.shade400, size: 20),
                  const SizedBox(width: 6),
                  Text(
                    'Đường dây nóng: ${config?.hotline ?? "1900 1234"}',
                    style: TextStyle(color: Colors.grey.shade500, fontSize: 20),
                  ),
                ],
              ),
            ),
          ),

          // Nút TIẾP THEO / HOÀN TẤT
          ElevatedButton.icon(
            onPressed: currentScore == 0 ? null : () => _nextPage(totalPages),
            icon: Icon(
              _currentPage == totalPages - 1 ? Icons.check_rounded : Icons.arrow_forward_rounded,
              size: 18,
            ),
            label: Text(
              _currentPage == totalPages - 1 ? 'HOÀN TẤT' : 'TIẾP THEO',
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: _currentPage == totalPages - 1 ? nhGreenDark : nhBlueDark,
              foregroundColor: Colors.white,
              disabledBackgroundColor: Colors.grey.shade300,
              padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 10),
              minimumSize: Size.zero,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              elevation: 1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryPage(Category category) {
    final provider = Provider.of<EvaluationProvider>(context);
    final currentScore = provider.ratings[category.id] ?? 0;
    final commentController = _getCommentController(category.id);

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // ===== BÊN TRÁI: Xếp chồng dọc - Icon → Tên → Mô tả → Stars =====
          Expanded(
            flex: 6,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 12)],
              ),
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                child: Column(
                  children: [
                    // Icon
                    Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(colors: [nhBlue.withOpacity(0.15), nhBlueLight.withOpacity(0.08)]),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(_getIconData(category.icon), size: 42, color: nhBlueDark),
                    ),
                    const SizedBox(height: 10),
                    // Tên tiêu chí
                    Text(
                      category.name,
                      style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 20),
                    // Mô tả
                    Text(
                      category.description ?? 'Vui lòng đánh giá trải nghiệm của bạn cho tiêu chí này.',
                      style: TextStyle(fontSize: 24, color: Colors.grey.shade600, height: 1.3),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 20),
                    // SAO ĐÁNH GIÁ
                    RatingBar.builder(
                      initialRating: currentScore.toDouble(),
                      minRating: 1,
                      itemCount: 5,
                      itemPadding: const EdgeInsets.symmetric(horizontal: 6),
                      itemBuilder: (context, index) => Icon(
                        Icons.star_rounded,
                        color: index < currentScore ? Colors.amber.shade600 : Colors.grey.shade300,
                      ),
                      onRatingUpdate: (rating) => provider.setRating(category.id, rating.toInt()),
                      itemSize: 100,
                    ),
                    const SizedBox(height: 12),
                    // Label
                    Text(
                      _getRatingLabel(currentScore),
                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.w600, color: currentScore > 0 ? nhBlueDark : Colors.grey.shade400),
                    ),
                  ],
                ),
              ),
            ),
          ),

          const SizedBox(width: 12),

          // ===== BÊN PHẢI: Phản hồi =====
          Expanded(
            flex: 4,
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 12)],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.edit_note_rounded, color: nhBlue, size: 28),
                      const SizedBox(width: 6),
                      const Text('Phản hồi của bạn',
                        style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                      ),
                      const Spacer(),
                      Text('Không bắt buộc', style: TextStyle(fontSize: 16, color: Colors.grey.shade400)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: TextField(
                        controller: commentController,
                        maxLines: null,
                        expands: true,
                        textAlignVertical: TextAlignVertical.top,
                        onChanged: (value) => provider.setComment(category.id, value),
                        decoration: InputDecoration(
                          hintText: 'Nhập phản hồi tại đây... \nVí dụ: Vệ sinh sạch sẽ, đồ ăn ngon, nhân viên nhiệt tình, ...',
                          hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 24),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.all(12),
                        ),
                        style: const TextStyle(fontSize: 14, height: 1.5),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getRatingLabel(int score) {
    switch (score) {
      case 1: return '😞 Rất không hài lòng';
      case 2: return '😐 Không hài lòng';
      case 3: return '🙂 Bình thường';
      case 4: return '😊 Hài lòng';
      case 5: return '🤩 Rất hài lòng';
      default: return 'Chạm vào ngôi sao để đánh giá';
    }
  }

  IconData _getIconData(String? iconName) {
    if (iconName == null) return Icons.list_alt_rounded;
    if (iconName.contains('star')) return Icons.star_rounded;
    if (iconName.contains('user') || iconName.contains('person')) return Icons.person_rounded;
    if (iconName.contains('thumbs-up') || iconName.contains('thumb')) return Icons.thumb_up_rounded;
    if (iconName.contains('smile') || iconName.contains('sentiment')) return Icons.sentiment_satisfied_alt_rounded;
    if (iconName.contains('utensils') || iconName.contains('restaurant')) return Icons.restaurant_rounded;
    if (iconName.contains('heart') || iconName.contains('favorite')) return Icons.favorite_rounded;
    if (iconName.contains('clock') || iconName.contains('time')) return Icons.access_time_rounded;
    if (iconName.contains('clean') || iconName.contains('spa')) return Icons.spa_rounded;
    if (iconName.contains('medical') || iconName.contains('health')) return Icons.medical_services_rounded;
    return Icons.list_alt_rounded;
  }
}
