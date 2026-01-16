# 📡 Network Access Guide

## Quick Start (Easiest Method)

### **Use the Auto Script:**

```bash
cd /Users/paulo-olibra/swiss
./start-server.sh
```

O script vai:
- ✅ Detectar seu IP automaticamente
- ✅ Mostrar a URL para acessar
- ✅ Iniciar o servidor
- ✅ Funcionar em Mac e Linux

**Exemplo de saída:**
```
🏆 Swiss Tournament Tracker - Network Server
===========================================

📡 Your local IP address: 192.168.1.5

🌐 Access from other devices on the same network:

   http://192.168.1.5:8080

📱 On your phone/tablet, open browser and type the URL above

🖥️  On this computer, use: http://localhost:8080

⏹️  Press Ctrl+C to stop the server
```

---

## Manual Methods

### **Method 1: Python (Built-in no Mac)**

```bash
# 1. Abrir Terminal
cd /Users/paulo-olibra/swiss

# 2. Iniciar servidor
python3 -m http.server 8080

# 3. Descobrir seu IP
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Acessar:** `http://SEU-IP:8080`

---

### **Method 2: Node.js**

Se você tem Node.js instalado:

```bash
cd /Users/paulo-olibra/swiss

# Opção A: usando npx (sem instalar)
npx serve -p 8080

# Opção B: usando http-server
npx http-server -p 8080
```

---

### **Method 3: PHP**

Se você tem PHP instalado:

```bash
cd /Users/paulo-olibra/swiss
php -S 0.0.0.0:8080
```

---

## Como Descobrir Seu IP Local

### **No Mac:**

**Opção 1: Terminal**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Opção 2: Interface Gráfica**
1. Preferências do Sistema
2. Rede
3. Wi-Fi (ou Ethernet)
4. Veja o "Endereço IP"

**Opção 3: Atalho rápido**
```bash
ipconfig getifaddr en0
```

### **No Windows:**

```cmd
ipconfig
```
Procure por "IPv4 Address" da conexão ativa

### **No Linux:**

```bash
hostname -I
```

---

## 📱 Acessando do Celular/Tablet

### **Passo 1:** Certifique-se que está na mesma rede Wi-Fi

### **Passo 2:** Abra o navegador (Chrome, Safari, etc)

### **Passo 3:** Digite a URL:
```
http://192.168.1.5:8080
```
*(substitua pelo SEU IP)*

### **Passo 4:** Pronto! 🎉

---

## 🔥 Dicas Importantes

### **✅ Funciona:**
- Mesmo Wi-Fi no celular e computador
- Mesma rede local
- Sem autenticação de rede restritiva

### **❌ NÃO funciona:**
- Redes diferentes
- Dados móveis (4G/5G) vs Wi-Fi
- Redes corporativas com firewall
- VPN ativa que isola conexões

### **🔒 Firewall:**
Se não funcionar, pode ser firewall do Mac bloqueando:

**Desabilitar temporariamente:**
```
Preferências do Sistema → Segurança → Firewall → Desligar
```

Ou adicionar exceção para Python na porta 8080.

---

## 🎯 Diferentes Cenários

### **Cenário 1: Torneio no Escritório**
1. Host roda o servidor no seu Mac
2. Compartilha URL: `http://192.168.0.100:8080`
3. Todos acessam nos navegadores
4. Cada um vê o estado atual
5. **Importante:** Apenas o host pode editar (localStorage local)

### **Cenário 2: Casa com Múltiplos Devices**
1. Deixa servidor rodando no computador
2. Acessa do iPad, iPhone, outro computador
3. Cada dispositivo tem seus próprios dados (localStorage separado)

### **Cenário 3: Demo/Apresentação**
1. Computador conectado ao projetor
2. Celular para controlar (navegar pelo app)
3. Ambos na mesma rede
4. Sincronização via Export/Import JSON

---

## 🔄 Compartilhar Dados Entre Dispositivos

Como os dados ficam no **localStorage** de cada navegador, para sincronizar:

### **Método 1: Export/Import JSON**
1. No device principal: **Tools → Backup → Export JSON**
2. Copiar o JSON
3. No outro device: **Tools → Backup → Import JSON**
4. Colar e importar

### **Método 2: Download/Upload**
1. **Tools → Download JSON** (salva arquivo)
2. Enviar arquivo por AirDrop, email, etc
3. No outro device: Abrir arquivo e copiar conteúdo
4. Import no app

---

## 🖥️ Manter Servidor Rodando

### **Terminal Dedicado:**
Deixa uma janela do Terminal aberta com servidor rodando

### **Background (tmux/screen):**
```bash
# Instalar tmux
brew install tmux

# Criar sessão
tmux new -s swiss

# Rodar servidor
cd /Users/paulo-olibra/swiss
python3 -m http.server 8080

# Detach: Ctrl+B, depois D
# Reattach: tmux attach -t swiss
```

### **Como Serviço (avançado):**
Para rodar sempre no boot, criar LaunchAgent no Mac.

---

## 🌐 URLs Úteis

### **No Computador Host:**
```
http://localhost:8080
http://127.0.0.1:8080
http://SEU-IP:8080
```

### **Em Outros Dispositivos:**
```
http://SEU-IP:8080
```

### **Descobrir IP Rápido:**
```bash
# Mac/Linux
ifconfig | grep "inet "

# Ou
ip addr show

# Mac específico
ipconfig getifaddr en0  # Wi-Fi
ipconfig getifaddr en1  # Ethernet
```

---

## 🛠️ Troubleshooting

### **❌ Não consigo acessar do celular**

**Check 1:** Mesma rede?
```bash
# No celular: Settings → Wi-Fi → Ver nome da rede
# No computador: Ver nome da rede
```

**Check 2:** Firewall bloqueando?
```bash
# Desabilitar firewall temporariamente
```

**Check 3:** IP correto?
```bash
# Confirmar IP novamente
ifconfig | grep "inet "
```

**Check 4:** Servidor rodando?
```bash
# Deve ver mensagem no Terminal:
# "Serving HTTP on 0.0.0.0 port 8080..."
```

**Check 5:** Porta correta?
```
http://192.168.1.5:8080
                   ^^^^ - não esquecer :8080
```

### **❌ Connection Refused**

- Servidor não está rodando
- Firewall bloqueando
- Rede corporativa com restrições

### **❌ Page Not Loading**

- Checar se `index.html` está na pasta
- Confirmar que está na pasta correta no Terminal
- Tentar recarregar página (F5)

---

## 📊 Performance em Rede

### **Velocidade:**
- Local (localhost): Instantâneo
- Rede local (LAN): <10ms
- Muito rápido, sem lag

### **Múltiplos Usuários:**
- Servidor suporta múltiplas conexões
- Cada um tem sua própria sessão
- Sem limite prático

### **Dados:**
- App é client-side (JavaScript)
- Tudo roda no navegador
- Servidor só serve arquivos estáticos
- Sem processamento server-side

---

## 🚀 Produção (Hospedar Online)

Para acessar de QUALQUER lugar (não só rede local):

### **Opção 1: GitHub Pages (Grátis)**
```bash
# Já está pronto para GitHub Pages!
# Siga o guia no README.md
```

URL final: `https://seu-usuario.github.io/swiss/`

### **Opção 2: Netlify/Vercel (Grátis)**
- Drag & drop da pasta
- Deploy automático
- HTTPS grátis

### **Opção 3: Ngrok (Túnel temporário)**
```bash
# Instalar
brew install ngrok

# Rodar servidor local
python3 -m http.server 8080

# Em outro terminal
ngrok http 8080

# Pegar URL pública temporária
# https://abc123.ngrok.io
```

---

## 🎓 Resumo Rápido

### **Para Rede Local (LAN):**
```bash
cd /Users/paulo-olibra/swiss
./start-server.sh
# Acessar http://SEU-IP:8080 do celular
```

### **Para Internet (Mundo todo):**
```bash
# Deploy no GitHub Pages
# Ver README.md para instruções
```

---

**Agora você pode acessar o torneio de qualquer dispositivo na rede!** 📱💻🎉
