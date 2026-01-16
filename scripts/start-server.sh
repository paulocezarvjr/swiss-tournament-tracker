#!/bin/bash

# Swiss Tournament Tracker - Network Server Launcher
# ===================================================

echo "🏆 Swiss Tournament Tracker - Network Server"
echo "==========================================="
echo ""

# Get local IP
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
else
    # Linux
    LOCAL_IP=$(hostname -I | awk '{print $1}')
fi

if [ -z "$LOCAL_IP" ]; then
    echo "⚠️  Could not detect local IP address"
    LOCAL_IP="YOUR_IP_HERE"
fi

echo "📡 Your local IP address: $LOCAL_IP"
echo ""
echo "🌐 Access from other devices on the same network:"
echo ""
echo "   http://$LOCAL_IP:8080"
echo ""
echo "📱 On your phone/tablet, open browser and type the URL above"
echo ""
echo "🖥️  On this computer, use: http://localhost:8080"
echo ""
echo "⏹️  Press Ctrl+C to stop the server"
echo ""
echo "Starting server..."
echo "==========================================="
echo ""

# Start Python HTTP server
python3 -m http.server 8080
