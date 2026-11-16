"use client";
import { useState } from "react";
import { Home, Radio, Target, Users, Wallet, UserRound, Sparkles, ShieldCheck, Gift, Menu } from "lucide-react";

type Tab = "Início" | "Lives" | "Tarefas" | "Indicações" | "Carteira" | "Perfil";
const tabs: {label:Tab; icon:any}[] = [
  {label:"Início",icon:Home},{label:"Lives",icon:Radio},{label:"Tarefas",icon:Target},
  {label:"Indicações",icon:Users},{label:"Carteira",icon:Wallet},{label:"Perfil",icon:UserRound}
];
export default function HomePage() {
  const [tab,setTab]=useState<Tab>("Início");
  const [done,setDone]=useState<number[]>([]);
  const tasks=[["Conheça a comunidade","Complete seu perfil e explore o VivaClub.","R$ 2,00"],["Compartilhe uma publicação","Compartilhe uma publicação pública do VivaClub.","R$ 1,50"],["Participe de uma campanha","Veja campanhas disponíveis para membros.","Até R$ 15,00"]];
  return <main className="shell">
    <aside className="sidebar"><div className="brand"><b>V</b><strong>Viva<span>Club</span></strong></div><small>MENU PRINCIPAL</small>{tabs.map(({label,icon:Icon})=><button className={tab===label?"active":""} onClick={()=>setTab(label)} key={label}><Icon size={18}/>{label}</button>)}<p className="side-note"><ShieldCheck size={15}/> Comunidade 18+</p></aside>
    <section className="main"><header><button className="menu"><Menu/></button><span>VivaClub / {tab}</span><span className="avatar">VC</span></header>
    <div className="content">{tab==="Início"?<>
      <p className="eyebrow"><Sparkles size={15}/> SUA COMUNIDADE, SUAS OPORTUNIDADES</p><h1>Bem-vindo ao <em>VivaClub.</em></h1><p>Conecte-se, participe e descubra novas formas de crescer junto.</p>
      <div className="grid"><article className="gold"><small>Saldo disponível</small><h2>R$ 0,00</h2><p>Valores demonstrativos nesta versão.</p><button onClick={()=>setTab("Carteira")}>Ver carteira →</button></article><article><small>Atividades concluídas</small><h2>{done.length}</h2><p>Continue participando.</p></article><article><small>Saldo pendente</small><h2>R$ 0,00</h2><p>Aguardando validação.</p></article></div>
      <h2>O que está acontecendo</h2><div className="cards"><button onClick={()=>setTab("Lives")}><Radio/><b>Entre nas lives</b><span>Converse e conheça pessoas.</span></button><button onClick={()=>setTab("Tarefas")}><Target/><b>Missões e tarefas</b><span>Descubra atividades e campanhas.</span></button><button onClick={()=>setTab("Indicações")}><Users/><b>Convide sua turma</b><span>Compartilhe a comunidade.</span></button></div>
      <h2>Comece por aqui</h2><TaskList tasks={tasks.slice(0,2)} done={done} onDone={id=>setDone([...done,id])}/>
    </>:tab==="Tarefas"?<><p className="eyebrow">CENTRAL DE OPORTUNIDADES</p><h1>Missões e tarefas</h1><p>Atividades para a comunidade. Recompensas dependem de validação e orçamento de cada campanha.</p><div className="notice"><ShieldCheck/> Nenhuma tarefa exige depósito ou pagamento para participar.</div><TaskList tasks={tasks} done={done} onDone={id=>setDone([...done,id])}/></>
    :tab==="Lives"?<><p className="eyebrow">COMUNIDADE AO VIVO</p><h1>Lives e salas</h1><div className="empty"><Radio size={32}/><h2>As transmissões estão chegando</h2><p>A conexão de vídeo e áudio será ativada na próxima etapa, com moderação e ferramentas de segurança.</p></div></>
    :tab==="Indicações"?<><p className="eyebrow">CRESÇA COM A COMUNIDADE</p><h1>Convide e compartilhe</h1><div className="empty"><Users size={32}/><h2>Uma comunidade cresce junto.</h2><p>Seu link individual será gerado após o cadastro real.</p><code>vivaclub.app/convite/SEU-CODIGO</code></div></>
    :tab==="Carteira"?<><p className="eyebrow">TRANSPARÊNCIA</p><h1>Minha carteira</h1><div className="grid"><article className="gold"><small>Saldo disponível</small><h2>R$ 0,00</h2></article><article><small>Saldo pendente</small><h2>R$ 0,00</h2></article></div><div className="notice">Saques reais ainda não estão habilitados. Esta versão não movimenta dinheiro.</div></>
    :<><p className="eyebrow">SUA CONTA</p><h1>Meu perfil</h1><div className="empty"><UserRound size={32}/><h2>Membro VivaClub</h2><p>Conta de demonstração · Cadastro pendente</p><p>O cadastro será destinado exclusivamente a maiores de 18 anos.</p></div></>}
    </div><footer>© 2026 VivaClub <span>Conecte. Participe. Conquiste.</span> Versão de demonstração</footer></section>
    <nav className="mobile">{tabs.map(({label,icon:Icon})=><button onClick={()=>setTab(label)} className={tab===label?"active":""} key={label}><Icon size={18}/><small>{label}</small></button>)}</nav>
  </main>;
}
function TaskList({tasks,done,onDone}:{tasks:string[][];done:number[];onDone:(id:number)=>void}) {
 return <div className="task-list">{tasks.map((t,i)=><div className="task" key={i}><Gift/><div><b>{t[0]}</b><p>{t[1]}</p></div><strong>{t[2]}</strong><button disabled={done.includes(i)} onClick={()=>onDone(i)}>{done.includes(i)?"Enviada":"Participar"}</button></div>)}</div>;
}
