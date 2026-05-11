import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/evaluation_provider.dart';
import 'screens/welcome_screen.dart';
import 'config/app_config.dart';

class MyHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback = (X509Certificate cert, String host, int port) => true;
  }
}

void main() async {
  HttpOverrides.global = MyHttpOverrides();
  WidgetsFlutterBinding.ensureInitialized();
  await AppConfig.loadBaseUrl();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => EvaluationProvider()..init()),
      ],
      child: const NutrihealthApp(),
    ),
  );
}

class NutrihealthApp extends StatelessWidget {
  const NutrihealthApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nutrihealth Evaluation',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6366F1),
          primary: const Color(0xFF6366F1),
          secondary: const Color(0xFFA855F7),
        ),
        textTheme: GoogleFonts.interTextTheme(
          Theme.of(context).textTheme,
        ),
      ),
      home: const WelcomeScreen(),
    );
  }
}
