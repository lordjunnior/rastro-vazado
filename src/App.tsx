import { useState } from 'react';
import { ShieldAlert, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { SuiteHero, Stat, Faq } from './SovereignKit';
import { countInRange, entropyBits, exposureLevel, parseXonBreaches, splitHash, type Breach } from './lib/public-radar';

async function sha1(text: string) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

const verdict = {
  limpa: { t: 'NÃ£o encontrada nos vazamentos conhecidos', c: 'ss-ok' },
  baixa: { t: 'JÃ¡ apareceu em vazamentos. Troque.', c: 'ss-bad' },
  alta: { t: 'ExposiÃ§Ã£o alta. Troque em todos os serviÃ§os.', c: 'ss-bad' },
  critica: { t: 'ExposiÃ§Ã£o crÃ­tica. EstÃ¡ em listas de ataque.', c: 'ss-bad' },
};

const PT: Record<string, string> = { 'Email addresses': 'e-mails', Names: 'nomes', Passwords: 'senhas', 'Phone numbers': 'telefones', 'Physical addresses': 'endereÃ§os', 'Dates of birth': 'datas de nascimento', Genders: 'gÃªnero', 'IP addresses': 'IPs', Usernames: 'usuÃ¡rios', 'Geographic locations': 'localizaÃ§Ã£o', 'Government issued IDs': 'documentos oficiais', Employers: 'empregadores', 'Job titles': 'cargos', 'Device information': 'dados do aparelho', 'Browser user agents': 'navegador', 'Credit cards': 'cartÃµes de crÃ©dito', 'Bank account numbers': 'contas bancÃ¡rias' };

export default function RastroVazado() {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ count: number; prefix: string; at: string } | null>(null);
  const [err, setErr] = useState('');
  const [mode, setMode] = useState<'senha' | 'email'>('senha');
  const [email, setEmail] = useState('');
  const [mail, setMail] = useState<{ list: Breach[]; at: string } | null>(null);

  const checkEmail = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) { setErr('Digite um e-mail vÃ¡lido.'); return; }
    setBusy(true); setErr(''); setMail(null);
    try {
      const r = await fetch(`https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(e)}`);
      if (r.status === 404) setMail({ list: [], at: new Date().toLocaleString('pt-BR') });
      else if (!r.ok) throw new Error(String(r.status));
      else setMail({ list: parseXonBreaches(await r.json()), at: new Date().toLocaleString('pt-BR') });
    } catch { setErr('A base XposedOrNot nÃ£o respondeu agora. Tente de novo em instantes.'); }
    setBusy(false);
  };

  const check = async () => {
    if (!pw) return;
    setBusy(true); setErr(''); setRes(null);
    try {
      const { prefix, suffix } = splitHash(await sha1(pw));
      const r = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, { headers: { 'Add-Padding': 'true' } });
      if (!r.ok) throw new Error(String(r.status));
      setRes({ count: countInRange(await r.text(), suffix), prefix, at: new Date().toLocaleString('pt-BR') });
    } catch { setErr('A base Pwned Passwords nÃ£o respondeu agora. Tente de novo em instantes.'); }
    setBusy(false);
  };

  const lvl = res ? exposureLevel(res.count) : null;
  const bits = entropyBits(pw);

  return <div className="ss-root">
    <SuiteHero kicker="Privacidade Â· OPSEC" title="Rastro" accent="Vazado" repo="https://haveibeenpwned.com/Passwords" repoLabel="PWNED PASSWORDS (HAVE I BEEN PWNED)" prefix="BASE PÃšBLICA"
      note="SUA SENHA NUNCA SAI DO APARELHO Â· SÃ“ 5 CARACTERES DO HASH SÃƒO ENVIADOS"
      lead="Descubra se uma senha jÃ¡ circula em vazamentos de bancos de dados invadidos. A senha vira um cÃ³digo SHA-1 no seu navegador e sÃ³ os 5 primeiros caracteres desse cÃ³digo sÃ£o consultados. A comparaÃ§Ã£o final acontece aqui." />
    <div className="ss-wrap">
      <div className="ss-row" role="tablist" aria-label="Tipo de verificaÃ§Ã£o" style={{ marginTop: 0 }}>
        {(['senha', 'email'] as const).map(m => <button key={m} type="button" role="tab" aria-selected={mode === m} className={`ss-btn${mode === m ? '' : ' ghost'}`} onClick={() => { setMode(m); setErr(''); }}>{m === 'senha' ? 'Senha' : 'E-mail e contas expostas'}</button>)}
      </div>
      {mode === 'senha' &&       <section className="ss-plate">
        <span className="ss-tag">01 Â· VERIFICAÃ‡ÃƒO</span>
        <h2>Teste uma senha</h2>
        <label className="ss-label" htmlFor="rv-pw">Senha</label>
        <div className="ss-row" style={{ marginTop: 0 }}>
          <input id="rv-pw" className="ss-input" style={{ flex: 1 }} type={show ? 'text' : 'password'} autoComplete="off" value={pw} onChange={e => { setPw(e.target.value); setRes(null); }} onKeyDown={e => e.key === 'Enter' && check()} />
          <button type="button" className="ss-btn ghost" aria-label={show ? 'Ocultar' : 'Mostrar'} onClick={() => setShow(s => !s)}>{show ? <EyeOff size={14} /> : <Eye size={14} />}</button>
          <button type="button" className="ss-btn" disabled={!pw || busy} onClick={check}>{busy ? 'Varrendoâ€¦' : 'Verificar'}</button>
        </div>
        {err && <p className="ss-warn" style={{ marginTop: 16 }}>{err}</p>}
        {res && lvl && <div style={{ marginTop: 22 }} aria-live="polite">
          <p className={verdict[lvl].c} style={{ fontSize: 18, display: 'flex', gap: 10, alignItems: 'center' }}>{lvl === 'limpa' ? <ShieldCheck /> : <ShieldAlert />}{verdict[lvl].t}</p>
          <div className="ss-stats" style={{ marginTop: 16 }}>
            <Stat value={res.count.toLocaleString('pt-BR')} label="Vezes em vazamentos" tone={res.count ? 'ember' : 'hot'} />
            <Stat value={`${bits} bits`} label="ForÃ§a estimada" />
            <Stat value={res.prefix} label="Ãšnico dado enviado" />
          </div>
          <p className="ss-sub" style={{ marginTop: 10 }}>Consultado em {res.at} na base Pwned Passwords. LimitaÃ§Ã£o: "nÃ£o encontrada" nÃ£o garante seguranÃ§a, sÃ³ que ela nÃ£o estÃ¡ nos vazamentos pÃºblicos conhecidos.</p>
        </div>}
      </section>}
      {mode === 'email' && <section className="ss-plate">
        <span className="ss-tag">01 Â· VERIFICAÃ‡ÃƒO DE E-MAIL</span>
        <h2>Em quais vazamentos seu e-mail estÃ¡</h2>
        <label className="ss-label" htmlFor="rv-mail">E-mail</label>
        <div className="ss-row" style={{ marginTop: 0 }}>
          <input id="rv-mail" className="ss-input" style={{ flex: 1 }} type="email" autoComplete="off" value={email} onChange={e => { setEmail(e.target.value); setMail(null); }} onKeyDown={e => e.key === 'Enter' && checkEmail()} />
          <button type="button" className="ss-btn" disabled={!email || busy} onClick={checkEmail}>{busy ? 'Varrendoâ€¦' : 'Verificar'}</button>
        </div>
        <p className="ss-sub" style={{ marginTop: 10 }}>AtenÃ§Ã£o: diferente da senha, o e-mail Ã© enviado como estÃ¡ para a base pÃºblica XposedOrNot, porque ela nÃ£o oferece busca anÃ´nima de e-mail. Este site nÃ£o guarda nada.</p>
        {err && <p className="ss-warn" style={{ marginTop: 16 }}>{err}</p>}
        {mail && <div style={{ marginTop: 22 }} aria-live="polite">
          <p className={mail.list.length ? 'ss-bad' : 'ss-ok'} style={{ fontSize: 18, display: 'flex', gap: 10, alignItems: 'center' }}>{mail.list.length ? <ShieldAlert /> : <ShieldCheck />}{mail.list.length ? `Encontrado em ${mail.list.length} vazamento(s)` : 'NÃ£o encontrado nos vazamentos conhecidos'}</p>
          {mail.list.length > 0 && <div className="ss-stats" style={{ marginTop: 16 }}>
            <Stat value={String(mail.list.length)} label="Vazamentos" tone="ember" />
            <Stat value={mail.list.reduce((n, b) => n + b.records, 0).toLocaleString('pt-BR')} label="Registros expostos nessas bases" />
            <Stat value={String(mail.list.filter(b => b.data.some(d => /password/i.test(d))).length)} label="Com senhas vazadas" tone="hot" />
          </div>}
          <ul style={{ display: 'grid', gap: 8, marginTop: 16, maxHeight: 520, overflowY: 'auto' }}>
            {mail.list.map((b, i) => <li key={b.name + i} style={{ padding: '10px 12px', borderLeft: '2px solid var(--ss-gold, #e8a33d)', background: i % 2 ? 'transparent' : 'rgba(232,163,61,.06)', fontSize: 13, lineHeight: 1.6 }}>
              <strong>{String(i + 1).padStart(2, '0')} Â· {b.name}</strong> {b.date && <span className="ss-sub">Â· {b.date}</span>}{b.domain && <span className="ss-sub"> Â· {b.domain}</span>}
              {b.data.length > 0 && <div className="ss-sub">Dados expostos: {b.data.map(d => PT[d] ?? d).join(', ')}</div>}
            </li>)}
          </ul>
          <p className="ss-sub" style={{ marginTop: 10 }}>Consultado em {mail.at} na base XposedOrNot. LimitaÃ§Ã£o: sÃ³ cobre vazamentos que se tornaram pÃºblicos; "nÃ£o encontrado" nÃ£o garante que o e-mail nunca vazou.</p>
        </div>}
      </section>}
      <section className="ss-plate">
        <span className="ss-tag">02 Â· MITIGAÃ‡ÃƒO</span>
        <h2>Plano imediato</h2>
        <ul style={{ display: 'grid', gap: 10, fontSize: 13, lineHeight: 1.7 }}>
          <li>01 Â· Troque a senha exposta em todo serviÃ§o onde ela foi repetida.</li>
          <li>02 Â· Use um gerenciador de senhas offline e uma senha diferente por serviÃ§o.</li>
          <li>03 Â· Para a senha mestra, use uma frase Diceware de 6 palavras ou mais.</li>
          <li>04 Â· Ative autenticaÃ§Ã£o em dois fatores por aplicativo ou chave fÃ­sica, nunca por SMS.</li>
          <li>05 Â· Use e-mails diferentes para banco, compras e cadastros descartÃ¡veis.</li>
        </ul>
      </section>
      <Faq items={[
        { q: 'Minha senha Ã© enviada para algum lugar?', a: 'NÃ£o. Ela Ã© convertida em SHA-1 no seu navegador e apenas os 5 primeiros caracteres desse cÃ³digo vÃ£o para a base. A resposta traz centenas de cÃ³digos parecidos e a comparaÃ§Ã£o Ã© feita aqui.' },
        { q: 'DÃ¡ para checar meu e-mail?', a: 'Sim, na aba E-mail e contas expostas, pela base pÃºblica XposedOrNot. Nesse modo o e-mail Ã© enviado Ã  base, porque nÃ£o existe busca anÃ´nima de e-mail gratuita.' },
      ]} />
    </div>
  </div>;
}

