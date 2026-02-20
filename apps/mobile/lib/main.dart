import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/broadcast_screen.dart';
import 'screens/watch_screen.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'StreamApp',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const HomeScreen(),
        '/login': (context) => const LoginScreen(),
        '/broadcast': (context) => const BroadcastScreen(),
        '/watch': (context) => const WatchScreen(),
      },
      debugShowCheckedModeBanner: false,
    );
  }
}
