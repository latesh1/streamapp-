import 'package:flutter/material.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';

class BroadcastScreen extends StatefulWidget {
  const BroadcastScreen({super.key});

  @override
  State<BroadcastScreen> createState() => _BroadcastScreenState();
}

class _BroadcastScreenState extends State<BroadcastScreen> {
  final _localRenderer = RTCVideoRenderer();
  MediaStream? _localStream;

  @override
  void initState() {
    super.initState();
    _initRenderer();
    _startUserMedia();
  }

  Future<void> _initRenderer() async {
    await _localRenderer.initialize();
  }

  Future<void> _startUserMedia() async {
    final stream = await navigator.mediaDevices.getUserMedia({
      'audio': true,
      'video': {
        'facingMode': 'user',
      },
    });

    setState(() {
      _localStream = stream;
      _localRenderer.srcObject = _localStream;
    });
  }

  @override
  void dispose() {
    _localStream?.dispose();
    _localRenderer.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Broadcast')),
      body: Stack(
        children: [
          if (_localStream != null)
            RTCVideoView(_localRenderer, mirror: true)
          else
            const Center(child: CircularProgressIndicator()),
          Positioned(
            bottom: 20,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                FloatingActionButton(
                  onPressed: () {
                    // Logic to connect to LiveKit and publish
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Starting Broadcast... (Mock)')),
                    );
                  },
                  child: const Icon(Icons.videocam),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
