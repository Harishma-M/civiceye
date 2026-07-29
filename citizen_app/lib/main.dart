import 'package:flutter/material.dart';

void main() {
  runApp(const CivicEyeApp());
}

class CivicEyeApp extends StatelessWidget {
  const CivicEyeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CivicEye Citizen',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0284C7),
          brightness: Brightness.light,
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0284C7),
          brightness: Brightness.dark,
        ),
      ),
      home: const CitizenHomeScreen(),
    );
  }
}

class CitizenHomeScreen extends StatefulWidget {
  const CitizenHomeScreen({super.key});

  @override
  State<CitizenHomeScreen> createState() => _CitizenHomeScreenState();
}

class _CitizenHomeScreenState extends State<CitizenHomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const ReportTab(),
    const TrackTab(),
    const ChatbotTab(),
    const RewardsTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.remove_red_eye_outlined, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            const Text('CivicEye Citizen', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.camera_alt_outlined), label: 'Report'),
          NavigationDestination(icon: Icon(Icons.timeline), label: 'Track'),
          NavigationDestination(icon: Icon(Icons.chat_bubble_outline), label: 'AI Bot'),
          NavigationDestination(icon: Icon(Icons.military_tech_outlined), label: 'Rewards'),
        ],
      ),
    );
  }
}

class ReportTab extends StatelessWidget {
  const ReportTab({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF0284C7), Color(0xFF4F46E5)]),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Row(
              children: [
                Icon(Icons.auto_awesome, color: Colors.white, size: 28),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('AI-Powered Civic Reporting', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('Capture issue photo. AI auto-predicts category & routes to department.', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              minimumSize: const Size.fromHeight(50),
              backgroundColor: Theme.of(context).colorScheme.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () {},
            icon: const Icon(Icons.camera_alt),
            label: const Text('Capture Civic Issue Photo', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}

class TrackTab extends StatelessWidget {
  const TrackTab({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Complaint History & Real-Time Track Timeline'));
  }
}

class ChatbotTab extends StatelessWidget {
  const ChatbotTab({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('CivicEye AI Assistant Chatbot'));
  }
}

class RewardsTab extends StatelessWidget {
  const RewardsTab({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Civic Champion Rewards & Leaderboard'));
  }
}
