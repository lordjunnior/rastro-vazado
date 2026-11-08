<div align="center">

<img src="./public/og-cover.svg" alt="Rastro Vazado — auditoria de credenciais" width="100%" />

# RASTRO VAZADO

**Descubra se suas credenciais aparecem em vazamentos conhecidos.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=111)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=fff)](https://vite.dev/)
[![License](https://img.shields.io/badge/License-MIT-E8A33D?style=flat-square)](./LICENSE)

</div>

---

## Visão geral

Rastro Vazado consulta bases públicas de exposição para ajudar a identificar senhas e endereços de e-mail presentes em vazamentos conhecidos.

## Dois modos, duas regras de privacidade

### Senhas — verificação k-anonymity

1. O SHA-1 da senha é calculado no próprio navegador.
2. Apenas os primeiros cinco caracteres do hash são enviados ao endpoint de faixa do Pwned Passwords.
3. O sufixo permanece no dispositivo e é comparado localmente com a resposta.

A senha em texto puro não é enviada pelo fluxo de consulta de senhas. SHA-1 é usado aqui como identificador de consulta compatível com o serviço, não como mecanismo para armazenar ou proteger senhas.

### E-mail — consulta explícita ao XposedOrNot

No modo de e-mail, o endereço informado é enviado ao XposedOrNot como parâmetro da consulta. O serviço recebe o e-mail e pode processar metadados da requisição. Use esse modo somente se aceitar esse compartilhamento com o provedor.

A aplicação não mantém banco próprio nem salva os dados consultados em servidor próprio.

## Fontes

- [Have I Been Pwned — Pwned Passwords API](https://haveibeenpwned.com/API/v3#PwnedPasswords) — consulta por faixa de hash.
- [XposedOrNot API](https://xposedornot.com/api_doc) — consulta de exposição de e-mail.

## Limitações

- As bases cobrem vazamentos conhecidos e disponibilizados pelos provedores; ausência de resultado não prova que uma credencial nunca foi exposta.
- A contagem representa ocorrências reportadas pela fonte, não uma medição de ataques em tempo real.
- Troque credenciais expostas e nunca reutilize a mesma senha entre serviços.
- Não use uma senha real em dispositivos ou navegadores nos quais você não confia.

## Executar localmente

Requisitos: Node.js 20+ e npm.

```bash
npm install
npm run dev
npm test
npm run build
```

## Estrutura

```text
src/
├── App.tsx
├── SovereignKit.tsx
├── sovereign-suite.css
├── index.css
├── main.tsx
└── lib/
    ├── public-radar.ts
    └── public-radar.test.ts
```

## Autoria

Projeto independente de **Lord Junnior**.
