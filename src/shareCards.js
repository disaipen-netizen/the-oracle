// ── SHARE CARDS GENERATOR ──
// Генерирует красивые PNG карточки для шеринга

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x+r, y)
  ctx.lineTo(x+w-r, y); ctx.arcTo(x+w,y,x+w,y+r,r)
  ctx.lineTo(x+w, y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r)
  ctx.lineTo(x+r, y+h); ctx.arcTo(x,y+h,x,y+h-r,r)
  ctx.lineTo(x, y+r); ctx.arcTo(x,y,x+r,y,r)
  ctx.closePath()
}

function drawBg(ctx, W, H) {
  ctx.fillStyle = '#0b0a17'; ctx.fillRect(0,0,W,H)
  const glow = ctx.createRadialGradient(W/2, H*0.3, 0, W/2, H*0.3, 600)
  glow.addColorStop(0,'rgba(201,168,76,0.07)'); glow.addColorStop(1,'transparent')
  ctx.fillStyle=glow; ctx.fillRect(0,0,W,H)
}

function drawBorder(ctx, W, H) {
  ctx.strokeStyle='rgba(201,168,76,0.4)'; ctx.lineWidth=1.5
  ctx.strokeRect(44,44,W-88,H-88)
  ctx.strokeStyle='rgba(201,168,76,0.1)'; ctx.lineWidth=1
  ctx.strokeRect(58,58,W-116,H-116)
  // Corners
  [[72,72,1,1],[W-72,72,-1,1],[72,H-72,1,-1],[W-72,H-72,-1,-1]].forEach(([x,y,dx,dy])=>{
    ctx.strokeStyle='rgba(201,168,76,0.6)'; ctx.lineWidth=1.5
    ctx.beginPath(); ctx.moveTo(x,y+dy*24); ctx.lineTo(x,y); ctx.lineTo(x+dx*24,y); ctx.stroke()
  })
}

function drawDivider(ctx, W, y) {
  const dg=ctx.createLinearGradient(W/2-200,0,W/2+200,0)
  dg.addColorStop(0,'transparent'); dg.addColorStop(.5,'rgba(201,168,76,0.38)'); dg.addColorStop(1,'transparent')
  ctx.strokeStyle=dg; ctx.lineWidth=1
  ctx.beginPath(); ctx.moveTo(W/2-200,y); ctx.lineTo(W/2+200,y); ctx.stroke()
}

function wrapText(ctx, text, font, maxW) {
  ctx.font = font
  const words = text.split(' '); const lines = []; let line = ''
  for(const w of words) {
    const t = line ? line+' '+w : w
    if(ctx.measureText(t).width > maxW && line) { lines.push(line); line=w }
    else line = t
  }
  if(line) lines.push(line)
  return lines
}

function drawWatermark(ctx, W, H) {
  ctx.font='20px Tenor Sans,Arial,sans-serif'
  ctx.fillStyle='rgba(201,168,76,0.2)'; ctx.textAlign='center'
  ctx.fillText('theoracle.app', W/2, H-52)
}

async function canvasToBlob(canvas) {
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
}

async function exportCanvas(canvas, filename) {
  const blob = await canvasToBlob(canvas)
  const file = new File([blob], filename, {type:'image/png'})
  if(navigator.share && navigator.canShare && navigator.canShare({files:[file]})) {
    try { await navigator.share({files:[file], title:'THE ORACLE'}); return } catch(e) {}
  }
  downloadBlob(blob, filename)
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href=url; a.download=filename
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  setTimeout(()=>URL.revokeObjectURL(url), 1000)
}

// ── DIALOG CARDS (3 сообщения на карточку) ──
export async function shareDialogCards(shadowHistory, voiceName) {
  const chunks = []
  for(let i=0; i<shadowHistory.length; i+=3) chunks.push(shadowHistory.slice(i,i+3))

  for(let ci=0; ci<chunks.length; ci++) {
    const canvas = buildDialogCard(chunks[ci], voiceName, ci+1, chunks.length)
    await exportCanvas(canvas, `oracle-dialog-${ci+1}.png`)
    if(ci < chunks.length-1) await new Promise(r=>setTimeout(r,400))
  }
  return chunks.length
}

function buildDialogCard(msgs, voiceName, cardNum, totalCards) {
  const W=1080, PAD=80, MW=W-PAD*2
  const FONT_MSG='italic 300 32px Georgia,serif'
  const FONT_LABEL='500 20px Tenor Sans,Arial,sans-serif'
  const LH=48

  // Calculate height
  const tmp=document.createElement('canvas'); tmp.width=W; tmp.height=100
  const tc=tmp.getContext('2d')
  let totalH=280
  msgs.forEach(msg=>{
    const msgW=msg.role==='assistant'?MW*0.88:MW*0.82
    const lines=wrapText(tc,msg.content,FONT_MSG,msgW-48)
    totalH+=lines.length*LH+62+24
  })
  totalH+=100

  const H=Math.max(totalH,900)
  const canvas=document.createElement('canvas'); canvas.width=W; canvas.height=H
  const ctx=canvas.getContext('2d')

  drawBg(ctx,W,H); drawBorder(ctx,W,H)

  // Header
  ctx.textAlign='center'
  ctx.font='22px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.45)'
  ctx.fillText('THE ORACLE · АУДИЕНЦИЯ С ТЕНЬЮ', W/2, 108)
  ctx.font='300 52px Georgia,serif'; ctx.fillStyle='rgba(201,168,76,0.9)'
  ctx.fillText(voiceName, W/2, 172)
  if(totalCards>1) {
    ctx.font='20px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.35)'
    ctx.fillText(`${cardNum} / ${totalCards}`, W/2, 208)
  }
  drawDivider(ctx,W,226)

  let y=250
  msgs.forEach(msg=>{
    const isShadow=msg.role==='assistant'
    const msgW=isShadow?MW*0.88:MW*0.82
    const lines=wrapText(ctx,msg.content,FONT_MSG,msgW-48)
    const boxH=lines.length*LH+62

    if(isShadow) {
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

// ── IMPRINT CARDS (3 карточки) ──
export async function shareImprintCards(imprint) {
  const cards = [
    {label:'Скрытый ресурс', text:imprint.resource, isGrowth:false},
    {label:'Системный блок', text:imprint.block,    isGrowth:false},
    {label:'Следующая точка роста', text:imprint.growth, isGrowth:true},
  ].filter(c=>c.text)

  for(let i=0; i<cards.length; i++) {
    const canvas = buildImprintCard(imprint.archetype, cards[i].label, cards[i].text, i+1, cards.length, cards[i].isGrowth)
    await exportCanvas(canvas, `oracle-imprint-${i+1}.png`)
    if(i < cards.length-1) await new Promise(r=>setTimeout(r,400))
  }
  return cards.length
}

function buildImprintCard(archetype, label, text, cardNum, total, isGrowth) {
  const W=1080, PAD=72, MW=W-PAD*2
  const FONT=isGrowth?'italic 300 38px Georgia,serif':'300 36px Georgia,serif'
  const LH=isGrowth?58:54

  const tmp=document.createElement('canvas'); tmp.width=W; tmp.height=100
  const tc=tmp.getContext('2d')
  const lines=wrapText(tc,text,FONT,MW-56)

  const labelH=isGrowth?118:82
  const H=Math.max(340+labelH+lines.length*LH+36+120, 700)
  const canvas=document.createElement('canvas'); canvas.width=W; canvas.height=H
  const ctx=canvas.getContext('2d')

  drawBg(ctx,W,H)

  if(isGrowth) {
    const g2=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,500)
    g2.addColorStop(0,'rgba(201,168,76,0.06)'); g2.addColorStop(1,'transparent')
    ctx.fillStyle=g2; ctx.fillRect(0,0,W,H)
  }

  drawBorder(ctx,W,H)
  if(isGrowth) {
    ctx.strokeStyle='rgba(201,168,76,0.5)'; ctx.lineWidth=1.5
    ctx.strokeRect(44,44,W-88,H-88)
  }

  // Sigil
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
  ctx.fillText(archetype, W/2, 272)
  ctx.shadowBlur=0
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

  if(isGrowth) {
    ctx.font='500 26px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.5)'; ctx.textAlign='center'
    ctx.fillText('✦', W/2, boxY+30)
    ctx.font='500 30px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.92)'
    ctx.shadowColor='rgba(201,168,76,0.4)'; ctx.shadowBlur=10
    ctx.fillText(label.toUpperCase(), W/2, boxY+66)
    ctx.shadowBlur=0
    ctx.font='500 26px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.5)'
    ctx.fillText('✦', W/2, boxY+96)
  } else {
    ctx.fillStyle='rgba(201,168,76,0.7)'
    ctx.fillRect(PAD, boxY+16, 4, 44)
    ctx.font='600 28px Tenor Sans,Arial,sans-serif'; ctx.fillStyle='rgba(201,168,76,0.92)'; ctx.textAlign='left'
    ctx.shadowColor='rgba(201,168,76,0.3)'; ctx.shadowBlur=8
    ctx.fillText(label, PAD+22, boxY+48)
    ctx.shadowBlur=0
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
