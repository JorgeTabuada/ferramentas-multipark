# 🚀 **FERRAMENTAS MULTIPARK - SISTEMA COMPLETO**

<div align="center">

[![Status](https://img.shields.io/badge/Status-COMPLETO-brightgreen.svg)](https://github.com/JorgeTabuada/ferramentas-multipark)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Multi--Database-green.svg)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)

**Sistema completo de gestão Multipark com dashboard multi-base e integração Supabase**

[🔗 Ver Projeto](https://github.com/JorgeTabuada/ferramentas-multipark) | [📚 Documentação](#documentação) | [🚀 Deploy](#deploy)

</div>

---

## 🎯 **PROJETO 100% FUNCIONAL!**

### ✅ **O QUE ESTÁ IMPLEMENTADO:**

- **🔥 Sistema Multi-Database** - Dashboard + Ferramentas Supabase
- **🔑 Autenticação Completa** - Login, logout, gestão de sessões
- **📊 Dashboard Responsivo** - Interface moderna com ShadCN UI
- **📄 Upload de Excel** - Processamento automático de ficheiros
- **🗃️ Gestão de Reservas** - CRUD completo com filtros
- **⚙️ API Health Check** - Monitorização das bases de dados
- **🔧 Database Service** - UPSERT e sincronização automática

---

## 🏗️ **ARQUITETURA DO SISTEMA**

### **📋 Estrutura Multi-Database:**

```
🏢 DASHBOARD MULTIPARK (Base Operacional)
├── 📊 Reservas (tabela central)
├── 🏪 Parques 
├── 🚗 Movimentações de Veículos
├── 💰 Caixa e Transações
└── 👥 Profiles de Utilizadores

🛠️ FERRAMENTAS MULTIPARK (Base RH/Analytics)
├── 👨‍💼 RH e Colaboradores
├── 📚 Formação e Conteúdos
├── 🔍 Auditoria e Logs
├── 📈 Marketing e Campanhas
└── 🗺️ Mapas de Ocupação
```

### **🔗 Sincronização:**
- **Parques:** Sincronizados entre ambas as bases
- **Auth:** JWT partilhado entre sistemas
- **UPSERT:** License Plate + Allocation como chave única

---

## 🚀 **QUICK START**

### **1️⃣ Clonar o Repositório:**
```bash
git clone https://github.com/JorgeTabuada/ferramentas-multipark.git
cd ferramentas-multipark
```

### **2️⃣ Instalar Dependências:**
```bash
npm install
```

### **3️⃣ Configurar Environment:**
```bash
# O ficheiro .env.local já está criado com as keys!
# As service role keys estão configuradas e funcionais ✅
```

### **4️⃣ Executar em Desenvolvimento:**
```bash
npm run dev
```

**🎉 Aplicação disponível em:** `http://localhost:3000`

---

## 🔑 **CONFIGURAÇÃO DAS BASES SUPABASE**

### **✅ Já Configurado:**

#### **Dashboard Multipark:**
- **URL:** `https://ioftqsvjqwjeprsckeym.supabase.co`
- **Anon Key:** ✅ Configurada
- **Service Role:** ✅ Configurada

#### **Ferramentas Multipark:**
- **URL:** `https://dzdeewebxsfxeabdxtiq.supabase.co`
- **Anon Key:** ✅ Configurada
- **Service Role:** ✅ Configurada

### **🔧 Links de Gestão:**
- [Dashboard Supabase - Dashboard](https://supabase.com/dashboard/project/ioftqsvjqwjeprsckeym)
- [Dashboard Supabase - Ferramentas](https://supabase.com/dashboard/project/dzdeewebxsfxeabdxtiq)

---

## 📁 **ESTRUTURA DO PROJETO**

```
ferramentas-multipark/
├── 📂 app/
│   ├── 🏠 page.tsx                    # Login + Dashboard principal
│   ├── 📊 dashboard/                  # Dashboard components  
│   ├── 📄 reservas/                   # Gestão de reservas
│   ├── ⬆️ upload/                     # Upload de Excel
│   └── 🔌 api/
│       ├── ❤️ health/                 # Health check
│       ├── 📊 dashboard/              # APIs dashboard
│       ├── ⬆️ upload/                 # APIs upload
│       └── 🔄 sync/                   # Sincronização
├── 📂 lib/
│   ├── 🗃️ services/
│   │   └── database.service.ts        # Service principal (9KB)
│   └── 🔌 supabase/
│       ├── clients.ts                 # Clients multi-database
│       └── config.ts                  # Configuração
├── 📂 components/
│   ├── 🔐 LoginForm.tsx              # Formulário de login
│   ├── 📊 Dashboard.tsx              # Dashboard principal
│   └── 🎨 ui/                        # ShadCN UI components
├── 📂 hooks/
│   └── useAuth.tsx                    # Hook de autenticação
└── 📄 .env.local                     # ✅ Configurado com keys reais
```

---

## 🔥 **FUNCIONALIDADES PRINCIPAIS**

### **1️⃣ Sistema de Login:**
- **Autenticação:** Supabase Auth
- **Validação:** Perfil ativo obrigatório
- **Redirecionamento:** Dashboard após login
- **Gestão:** localStorage para compatibilidade

### **2️⃣ Dashboard Multi-Parque:**
- **Seleção:** Lisboa, Porto, Faro
- **Estatísticas:** Reservas em tempo real
- **Navegação:** Modular para subapps
- **Responsive:** Mobile-first design

### **3️⃣ Upload de Excel:**
- **Tipos:** Reservas, Caixa, Entregas, Recolhas
- **Processamento:** PapaParser + validação
- **UPSERT:** License Plate + Allocation
- **Feedback:** Resultados detalhados

### **4️⃣ Gestão de Reservas:**
- **Visualização:** Tabela com filtros
- **Pesquisa:** Matrícula, nome, código
- **Estados:** Reservado, Recolhido, Entregue
- **Estatísticas:** Cards informativos

### **5️⃣ API Health Check:**
- **Endpoint:** `/api/health`
- **Monitorização:** Ambas as bases
- **Resposta:** JSON detalhada
- **Status:** HTTP codes apropriados

---

## 🔧 **APIs DISPONÍVEIS**

### **📊 Dashboard:**
```
GET  /api/dashboard/reservas     # Listar reservas
POST /api/dashboard/reservas     # Criar reserva
```

### **⬆️ Upload:**
```
POST /api/upload                 # Upload multi-tipo Excel
```

### **❤️ Sistema:**
```
GET  /api/health                 # Health check
POST /api/sync/parques          # Sincronizar parques
```

---

## 🎯 **COMO USAR**

### **📄 Upload de Reservas:**
1. Ir para `/upload`
2. Selecionar tipo "Reservas"
3. Escolher parque (Lisboa/Porto/Faro)
4. Upload do ficheiro Excel
5. Ver resultados (inseridos/atualizados)

### **📊 Gestão de Reservas:**
1. Ir para `/reservas`
2. Usar filtros (parque, estado, datas)
3. Pesquisar por matrícula/nome
4. Ver detalhes e estatísticas

### **🔍 Monitorização:**
1. Aceder `/api/health`
2. Verificar status das bases
3. Confirmar conectividade

---

## 🚀 **DEPLOY**

### **Vercel (Recomendado):**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Variáveis de Ambiente (Vercel):**
Copiar todas as variáveis do `.env.local` para as environment variables do Vercel.

---

## 🔧 **COMANDOS ÚTEIS**

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Linting
npm run lint

# Type checking
npm run type-check

# Sync bases (manual)
curl -X POST http://localhost:3000/api/sync/parques
```

---

## 📚 **DOCUMENTAÇÃO TÉCNICA**

### **🗃️ Database Service:**
O `DatabaseService` centraliza todas as operações:
- **UPSERT de reservas** com License Plate + Allocation
- **Health check** das duas bases
- **Sincronização** automática de parques
- **Cross-database** operations

### **🔐 Autenticação:**
- **JWT sharing** entre bases
- **Profile validation** obrigatória
- **Role-based** access control
- **Session management** com localStorage

### **📤 Upload System:**
- **Multi-format:** Excel, CSV
- **Type-aware:** Reservas, Caixa, Entregas
- **Error handling:** Validação robusta
- **Progress feedback:** UX moderna

---

## 🎯 **PRÓXIMOS PASSOS**

### **✅ FEITO:**
- [x] Sistema multi-database
- [x] Login e dashboard
- [x] Upload de Excel
- [x] Gestão de reservas
- [x] APIs funcionais
- [x] Health check

### **🔥 EXPANDIR:**
- [ ] Mais subaplicações (23 módulos documentados)
- [ ] Dashboard analytics avançado
- [ ] Middleware de auth robusto
- [ ] Notificações em tempo real
- [ ] Mobile app

---

## 👨‍💻 **DESENVOLVIMENTO**

### **Stack Tecnológica:**
- **Frontend:** Next.js 15, React 18, TypeScript
- **UI:** ShadCN UI, Tailwind CSS, Lucide Icons
- **Backend:** Supabase Multi-Database, PostgreSQL
- **Auth:** Supabase Auth, JWT, RLS
- **Deploy:** Vercel, GitHub Actions

### **Padrões de Código:**
- **TypeScript** everywhere
- **Composition** over inheritance
- **Service layer** para lógica de negócio
- **Error boundaries** e handling
- **Responsive design** mobile-first

---

## 📞 **SUPORTE**

### **Links Importantes:**
- **GitHub:** [JorgeTabuada/ferramentas-multipark](https://github.com/JorgeTabuada/ferramentas-multipark)
- **Issues:** [Reportar problema](https://github.com/JorgeTabuada/ferramentas-multipark/issues)
- **Documentação:** Este README

### **Contacto:**
- **Desenvolvedor:** Jorge Tabuada
- **Email:** jorgetabuada@airpark.pt

---

<div align="center">

**🎉 SISTEMA MULTIPARK 100% FUNCIONAL! 🎉**

[![Status](https://img.shields.io/badge/Status-COMPLETO-brightgreen.svg)](https://github.com/JorgeTabuada/ferramentas-multipark)

*Desenvolvido com ❤️ para a gestão eficiente de parques de estacionamento*

</div>
