// shareCards.js — генерация PNG карточек для шеринга
// iOS-стратегия: каждый шеринг = отдельный user gesture

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r)
  ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r)
  ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r)
  ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r)
  ctx.closePath()
}

function drawBg(ctx, W, H) {
  ctx.fillStyle='#0b0a17'; ctx.fillRect(0,0,W,H)
  const g=ctx.createRadialGradient(W/2,H*0.3,0,W/2,H*0.3,600)
  g.addColorStop(0,'rgba(201,168,76,0.07)'); g.addColorStop(1,'transparent')
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H)
}

function drawBorder(ctx, W, H) {
  ctx.strokeStyle='rgba(201,168,76,0.4)'; ctx.lineWidth=1.5; ctx.strokeRect(44,44,W-88,H-88)
  ctx.strokeStyle='rgba(201,168,76,0.1)'; ctx.lineWidth=1; ctx.strokeRect(58,58,W-116,H-116)
  ;[[72,72,1,1],[W-72,72,-1,1],[72,H-72,1,-1],[W-72,H-72,-1,-1]].forEach(([x,y,dx,dy])=>{
    ctx.strokeStyle='rgba(201,168,76,0.6)'; ctx.lineWidth=1.5
    ctx.beginPath(); ctx.moveTo(x,y+dy*24); ctx.lineTo(x,y); ctx.lineTo(x+dx*24,y); ctx.stroke()
  })
}

function drawDivider(ctx, W, y) {
  const d=ctx.createLinearGradient(W/2-200,0,W/2+200,0)
  d.addColorStop(0,'transparent'); d.addColorStop(.5,'rgba(201,168,76,0.38)'); d.addColorStop(1,'transparent')
  ctx.strokeStyle=d; ctx.lineWidth=1
  ctx.beginPath(); ctx.moveTo(W/2-200,y); ctx.lineTo(W/2+200,y); ctx.stroke()
}

function wrapLines(ctx, text, font, maxW) {
  ctx.font=font
  const words=text.split(' '); const lines=[]; let line=''
  for(const w of words){const t=line?line+' '+w:w;if(ctx.measureText(t).width>maxW&&line){lines.push(line);line=w}else line=t}
  if(line) lines.push(line)
  return lines
}

function drawWatermark(ctx, W, H) {
  ctx.font='20px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.2)'; ctx.textAlign='center'
  ctx.fillText('theoracle.app', W/2, H-52)
}

// ── ГЕНЕРАЦИЯ ВСЕХ КАРТОЧЕК ВОЗВРАЩАЕТ МАССИВ DATA URL ──
// Это безопасно — никакого navigator.share, только превью

export function generateResultCard(result, cards, lang) {
  const W=1080, H=1920, PAD=72, MW=W-PAD*2
  const canvas=document.createElement('canvas'); canvas.width=W; canvas.height=H
  const ctx=canvas.getContext('2d')

  drawBg(ctx,W,H); drawBorder(ctx,W,H)

  // Sigil
  const sY=158
  ctx.strokeStyle='rgba(201,168,76,0.2)'; ctx.lineWidth=0.7
  ;[52,37,22].forEach(r=>{ctx.beginPath();ctx.arc(W/2,sY,r,0,Math.PI*2);ctx.stroke()})
  ctx.strokeStyle='rgba(201,168,76,0.6)'; ctx.lineWidth=1.2
  ctx.beginPath()
  ctx.moveTo(W/2,sY-50); ctx.lineTo(W/2+4,sY-5); ctx.lineTo(W/2+46,sY)
  ctx.lineTo(W/2+4,sY+5); ctx.lineTo(W/2,sY+50); ctx.lineTo(W/2-4,sY+5)
  ctx.lineTo(W/2-46,sY); ctx.lineTo(W/2-4,sY-5); ctx.closePath(); ctx.stroke()
  ctx.fillStyle='#c9a84c'; ctx.beginPath(); ctx.arc(W/2,sY,3.5,0,Math.PI*2); ctx.fill()

  ctx.textAlign='center'
  ctx.font='22px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.45)'
  ctx.fillText('THE ORACLE · ПСИХОЛОГИЧЕСКИЙ РАСКЛАД', W/2, 240)
  drawDivider(ctx,W,258)

  // Cards row
  const cW=260, cH=340, gap=30
  const totalCW=cards.length*cW+(cards.length-1)*gap
  const startX=(W-totalCW)/2
  const cY=278

  cards.forEach((c,i)=>{
    const cx=startX+i*(cW+gap)
    ctx.fillStyle='rgba(18,16,34,0.9)'
    roundRect(ctx,cx,cY,cW,cH,8); ctx.fill()
    ctx.strokeStyle='rgba(201,168,76,0.45)'; ctx.lineWidth=1.2
    roundRect(ctx,cx,cY,cW,cH,8); ctx.stroke()
    ctx.strokeStyle='rgba(201,168,76,0.12)'; ctx.lineWidth=0.8
    roundRect(ctx,cx+8,cY+8,cW-16,cH-16,5); ctx.stroke()
    ;[[cx+10,cY+10,1,1],[cx+cW-10,cY+10,-1,1],[cx+10,cY+cH-10,1,-1],[cx+cW-10,cY+cH-10,-1,-1]].forEach(([ax,ay,adx,ady])=>{
      ctx.strokeStyle='rgba(201,168,76,0.55)'; ctx.lineWidth=1
      ctx.beginPath(); ctx.moveTo(ax,ay+ady*14); ctx.lineTo(ax,ay); ctx.lineTo(ax+adx*14,ay); ctx.stroke()
    })
    ctx.font='italic 26px Cormorant Garamond,Georgia,serif'; ctx.fillStyle='rgba(201,168,76,0.4)'; ctx.textAlign='center'
    ctx.fillText(c.rom, cx+cW/2, cY+36)
    ctx.font='500 36px Cormorant Garamond,Georgia,serif'; ctx.fillStyle='#c9a84c'
    ctx.fillText(c.name, cx+cW/2, cY+cH/2+10)
    ctx.font='20px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.4)'
    ctx.fillText(c.position.toUpperCase(), cx+cW/2, cY+cH-24)
  })

  let y=cY+cH+60
  const blocks=[
    {label:'THE GRID · АРХИТЕКТУРА', text:result?.grid},
    {label:'BLIND SPOT · СЛЕПАЯ ЗОНА', text:result?.blind},
    {label:'THE ACTION · ИМПУЛЬС', text:result?.action},
  ].filter(b=>b.text)

  for(const b of blocks){
    const lines=wrapLines(ctx,b.text,'300 30px Georgia,serif',MW-48)
    const bH=lines.length*46+66
    ctx.fillStyle='rgba(201,168,76,0.04)'
    roundRect(ctx,PAD,y,MW,bH,8); ctx.fill()
    ctx.strokeStyle='rgba(201,168,76,0.2)'; ctx.lineWidth=1
    roundRect(ctx,PAD,y,MW,bH,8); ctx.stroke()
    ctx.font='500 20px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.65)'; ctx.textAlign='left'
    ctx.fillText(b.label, PAD+20, y+28)
    ctx.strokeStyle='rgba(201,168,76,0.12)'; ctx.lineWidth=0.8
    ctx.beginPath(); ctx.moveTo(PAD+20,y+36); ctx.lineTo(PAD+MW-20,y+36); ctx.stroke()
    ctx.font='300 30px Georgia,serif'; ctx.fillStyle='#ede5d3'
    lines.forEach((l,i)=>ctx.fillText(l,PAD+20,y+56+i*46))
    y+=bH+16
  }

  if(result?.shadow){
    const lines=wrapLines(ctx,result.shadow,'italic 300 32px Georgia,serif',MW-60)
    const bH=lines.length*50+80
    ctx.fillStyle='rgba(201,168,76,0.06)'
    roundRect(ctx,PAD,y,MW,bH,8); ctx.fill()
    ctx.strokeStyle='rgba(201,168,76,0.35)'; ctx.lineWidth=1.2
    roundRect(ctx,PAD,y,MW,bH,8); ctx.stroke()
    ctx.font='500 22px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.6)'; ctx.textAlign='center'
    ctx.fillText('✦  ВОПРОС ДЛЯ ТВОЕЙ ТЕНИ  ✦', W/2, y+34)
    ctx.strokeStyle='rgba(201,168,76,0.15)'; ctx.lineWidth=0.8
    ctx.beginPath(); ctx.moveTo(PAD+20,y+44); ctx.lineTo(PAD+MW-20,y+44); ctx.stroke()
    ctx.font='italic 300 32px Georgia,serif'; ctx.fillStyle='#f5ede0'
    lines.forEach((l,i)=>ctx.fillText(l,W/2,y+64+i*50))
  }

  drawWatermark(ctx,W,H)
  return [{ canvas, name: 'oracle-reading.png', label: 'Расклад' }]
}

export function generateDialogCards(shadowHistory, voiceName) {
  if(!shadowHistory.length) return []
  const chunks=[]
  for(let i=0;i<shadowHistory.length;i+=3) chunks.push(shadowHistory.slice(i,i+3))

  return chunks.map((msgs, ci) => ({
    canvas: buildDialogCard(msgs, voiceName, ci+1, chunks.length),
    name: `oracle-dialog-${ci+1}.png`,
    label: `Часть ${ci+1}/${chunks.length}`
  }))
}

export function generateImprintCards(imprint) {
  const cardDefs=[
    {label:'Скрытый ресурс',    text:imprint.resource, isGrowth:false},
    {label:'Системный блок',    text:imprint.block,    isGrowth:false},
    {label:'Следующая точка роста', text:imprint.growth, isGrowth:true},
  ].filter(c=>c.text)

  return cardDefs.map((c,i) => ({
    canvas: buildImprintCard(imprint.archetype, c.label, c.text, i+1, cardDefs.length, c.isGrowth),
    name: `oracle-imprint-${i+1}.png`,
    label: c.label
  }))
}

// ── ШЕРИНГ ОДНОЙ КАРТОЧКИ — вызывается прямо из onClick ──
export async function shareSingleCard(canvas, filename) {
  // Сначала пробуем Telegram WebApp API если доступен
  const tg = window.Telegram?.WebApp
  if (tg?.openTelegramLink) {
    // Telegram не имеет прямого API для шеринга файлов
    // но мы используем системный share через браузер
  }

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      const file = new File([blob], filename, { type: 'image/png' })

      // Пробуем системный share с файлом
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'THE ORACLE' })
          resolve('shared')
          return
        } catch (e) {
          // Пользователь отменил или error — пробуем скачать
        }
      }

      // Fallback — скачивание (работает везде)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      resolve('downloaded')
    }, 'image/png')
  })
}

// === Build dialog card ===
function buildDialogCard(msgs, voiceName, cardNum, totalCards) {
  const W=1080, PAD=80, MW=W-PAD*2
  const FONT_MSG='italic 300 28px Georgia,serif'
  const FONT_LABEL='500 18px Tenor Sans,Arial,sans-serif'
  const LH=42

  const tmp=document.createElement('canvas'); tmp.width=W; tmp.height=100
  const tc=tmp.getContext('2d')
  let totalH=280
  msgs.forEach(msg=>{
    const msgW=msg.role==='assistant'?MW*0.88:MW*0.82
    const lines=wrapLines(tc,msg.content,FONT_MSG,msgW-48)
    totalH+=lines.length*LH+62+24
  })
  const H=Math.max(totalH+100,900)

  const canvas=document.createElement('canvas'); canvas.width=W; canvas.height=H
  const ctx=canvas.getContext('2d')
  drawBg(ctx,W,H); drawBorder(ctx,W,H)

  ctx.textAlign='center'
  ctx.font='22px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.45)'
  ctx.fillText('THE ORACLE · АУДИЕНЦИЯ С ТЕНЬЮ', W/2, 108)
  ctx.font='300 52px Georgia,serif'; ctx.fillStyle='rgba(201,168,76,0.9)'
  ctx.fillText(voiceName, W/2, 172)
  if(totalCards>1){
    ctx.font='20px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.35)'
    ctx.fillText(`${cardNum} / ${totalCards}`, W/2, 208)
  }
  drawDivider(ctx,W,226)

  let y=250
  msgs.forEach(msg=>{
    const isShadow=msg.role==='assistant'
    const msgW=isShadow?MW*0.88:MW*0.82
    const lines=wrapLines(ctx,msg.content,FONT_MSG,msgW-48)
    const boxH=lines.length*LH+62

    if(isShadow){
      ctx.fillStyle='rgba(201,168,76,0.05)'
      roundRect(ctx,PAD,y,msgW,boxH,8); ctx.fill()
      ctx.strokeStyle='rgba(201,168,76,0.22)'; ctx.lineWidth=1
      roundRect(ctx,PAD,y,msgW,boxH,8); ctx.stroke()
      ctx.fillStyle='rgba(201,168,76,0.55)'
      roundRect(ctx,PAD,y+10,3,boxH-20,2); ctx.fill()
      ctx.font=FONT_LABEL; ctx.fillStyle='rgba(201,168,76,0.55)'; ctx.textAlign='left'
      ctx.fillText(voiceName.toUpperCase(), PAD+18, y+26)
      ctx.strokeStyle='rgba(201,168,76,0.1)'; ctx.lineWidth=0.8
      ctx.beginPath(); ctx.moveTo(PAD+18,y+34); ctx.lineTo(PAD+msgW-18,y+34); ctx.stroke()
      ctx.font=FONT_MSG; ctx.fillStyle='#f2ead8'; ctx.textAlign='left'
      lines.forEach((l,i)=>ctx.fillText(l,PAD+18,y+52+i*LH))
    } else {
      const bx=W-PAD-msgW
      ctx.fillStyle='rgba(255,255,255,0.03)'
      roundRect(ctx,bx,y,msgW,boxH,8); ctx.fill()
      ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=1
      roundRect(ctx,bx,y,msgW,boxH,8); ctx.stroke()
      ctx.fillStyle='rgba(200,180,140,0.22)'
      roundRect(ctx,bx+msgW-3,y+10,3,boxH-20,2); ctx.fill()
      ctx.font=FONT_LABEL; ctx.fillStyle='rgba(200,180,140,0.35)'; ctx.textAlign='right'
      ctx.fillText('Я', W-PAD-16, y+26)
      ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=0.8
      ctx.beginPath(); ctx.moveTo(bx+18,y+34); ctx.lineTo(bx+msgW-18,y+34); ctx.stroke()
      ctx.font=FONT_MSG; ctx.fillStyle='rgba(210,200,185,0.8)'; ctx.textAlign='right'
      lines.forEach((l,i)=>ctx.fillText(l,W-PAD-18,y+52+i*LH))
    }
    y+=boxH+20
  })

  drawWatermark(ctx,W,H)
  return canvas
}

// === Build imprint card ===
function buildImprintCard(archetype, label, text, cardNum, total, isGrowth) {
  const W=1080, PAD=72, MW=W-PAD*2
  const FONT=isGrowth?'italic 300 36px Georgia,serif':'300 34px Georgia,serif'
  const LH=isGrowth?54:50

  const tmp=document.createElement('canvas'); tmp.width=W; tmp.height=100
  const tc=tmp.getContext('2d')
  const lines=wrapLines(tc,text,FONT,MW-56)

  const labelH=isGrowth?118:82
  const H=Math.max(340+labelH+lines.length*LH+36+120,700)
  const canvas=document.createElement('canvas'); canvas.width=W; canvas.height=H
  const ctx=canvas.getContext('2d')

  drawBg(ctx,W,H)
  if(isGrowth){
    const g2=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,500)
    g2.addColorStop(0,'rgba(201,168,76,0.06)'); g2.addColorStop(1,'transparent')
    ctx.fillStyle=g2; ctx.fillRect(0,0,W,H)
  }
  drawBorder(ctx,W,H)
  if(isGrowth){ctx.strokeStyle='rgba(201,168,76,0.5)';ctx.lineWidth=1.5;ctx.strokeRect(44,44,W-88,H-88)}

  const sY=130
  ctx.strokeStyle='rgba(201,168,76,0.2)'; ctx.lineWidth=0.7
  ;[56,40,24].forEach(r=>{ctx.beginPath();ctx.arc(W/2,sY,r,0,Math.PI*2);ctx.stroke()})
  ctx.strokeStyle='rgba(201,168,76,0.6)'; ctx.lineWidth=1.2
  ctx.beginPath()
  ctx.moveTo(W/2,sY-54); ctx.lineTo(W/2+4,sY-6); ctx.lineTo(W/2+50,sY)
  ctx.lineTo(W/2+4,sY+6); ctx.lineTo(W/2,sY+54); ctx.lineTo(W/2-4,sY+6)
  ctx.lineTo(W/2-50,sY); ctx.lineTo(W/2-4,sY-6); ctx.closePath(); ctx.stroke()
  ctx.fillStyle='#c9a84c'; ctx.beginPath(); ctx.arc(W/2,sY,4,0,Math.PI*2); ctx.fill()

  ctx.textAlign='center'
  ctx.font='22px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.45)'
  ctx.fillText('✦  ЦИФРОВОЙ СЛЕПОК ТЕНИ  ✦', W/2, 210)
  ctx.font='300 54px Georgia,serif'; ctx.fillStyle='#c9a84c'
  ctx.shadowColor='rgba(201,168,76,0.3)'; ctx.shadowBlur=16
  ctx.fillText(archetype, W/2, 272); ctx.shadowBlur=0
  ctx.font='20px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.3)'
  ctx.fillText(`${cardNum} / ${total}`, W/2, 302)
  drawDivider(ctx,W,322)

  const boxY=338, boxH=labelH+lines.length*LH+36
  ctx.fillStyle=`rgba(201,168,76,${isGrowth?'0.07':'0.04'})`
  roundRect(ctx,PAD,boxY,MW,boxH,10); ctx.fill()
  ctx.strokeStyle=`rgba(201,168,76,${isGrowth?'0.48':'0.22'})`; ctx.lineWidth=isGrowth?1.5:1
  roundRect(ctx,PAD,boxY,MW,boxH,10); ctx.stroke()

  const sh=ctx.createLinearGradient(PAD,0,PAD+MW,0)
  sh.addColorStop(0,'transparent'); sh.addColorStop(.5,`rgba(201,168,76,${isGrowth?'0.38':'0.22'})`); sh.addColorStop(1,'transparent')
  ctx.strokeStyle=sh; ctx.lineWidth=isGrowth?1.5:1
  ctx.beginPath(); ctx.moveTo(PAD+20,boxY); ctx.lineTo(PAD+MW-20,boxY); ctx.stroke()

  if(isGrowth){
    ctx.font='500 26px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.5)'; ctx.textAlign='center'
    ctx.fillText('✦', W/2, boxY+30)
    ctx.font='500 30px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.92)'
    ctx.shadowColor='rgba(201,168,76,0.4)'; ctx.shadowBlur=10
    ctx.fillText(label.toUpperCase(), W/2, boxY+66); ctx.shadowBlur=0
    ctx.font='500 26px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.5)'
    ctx.fillText('✦', W/2, boxY+96)
  } else {
    ctx.fillStyle='rgba(201,168,76,0.7)'; ctx.fillRect(PAD,boxY+16,4,44)
    ctx.font='600 28px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.92)'; ctx.textAlign='left'
    ctx.shadowColor='rgba(201,168,76,0.3)'; ctx.shadowBlur=8
    ctx.fillText(label, PAD+22, boxY+48); ctx.shadowBlur=0
  }

  const sepG=ctx.createLinearGradient(PAD+20,0,PAD+MW-20,0)
  sepG.addColorStop(0,'transparent'); sepG.addColorStop(.4,'rgba(201,168,76,0.22)'); sepG.addColorStop(.6,'rgba(201,168,76,0.22)'); sepG.addColorStop(1,'transparent')
  ctx.strokeStyle=sepG; ctx.lineWidth=0.8
  ctx.beginPath(); ctx.moveTo(PAD+20,boxY+labelH-8); ctx.lineTo(PAD+MW-20,boxY+labelH-8); ctx.stroke()

  ctx.font=FONT; ctx.fillStyle=isGrowth?'#f5ede0':'#ede5d3'
  ctx.textAlign=isGrowth?'center':'left'
  const tx=isGrowth?W/2:PAD+28
  lines.forEach((l,i)=>ctx.fillText(l,tx,boxY+labelH+16+i*LH))

  drawWatermark(ctx,W,H)
  return canvas
}
