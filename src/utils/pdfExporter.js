import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Utility: generate PDF client-side by snapshotting sections with html2canvas
// and assembling them into a multi-page PDF with jsPDF. Designed to work
// without server-side rendering. For best quality set html2canvas scale >=2.

async function elementToCanvas(element, scale = 2){
  // clone to avoid layout shifts
  return await html2canvas(element, {
    scale,
    useCORS: true,
    backgroundColor: '#ffffff'
  })
}

function addCanvasToPDF(doc, canvas, marginMm = 16){
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const pdfWidth = pageWidth - marginMm * 2

  const canvasWidth = canvas.width
  const canvasHeight = canvas.height

  // compute scale to fit canvas width into pdfWidth (mm)
  const imgProps = { width: canvasWidth, height: canvasHeight }

  // scaling: pdf image height in mm
  const imgHeightMm = (canvasHeight * pdfWidth) / canvasWidth

  // convert to canvas px per page height using ratio
  const sliceHeightPx = Math.floor((canvasWidth * (pageHeight - marginMm * 2)) / pdfWidth)

  let y = 0
  while(y < canvasHeight){
    const h = Math.min(sliceHeightPx, canvasHeight - y)
    // create temp canvas for slice
    const tmpCanvas = document.createElement('canvas')
    tmpCanvas.width = canvasWidth
    tmpCanvas.height = h
    const tctx = tmpCanvas.getContext('2d')
    tctx.fillStyle = '#ffffff'
    tctx.fillRect(0,0,tmpCanvas.width,tmpCanvas.height)
    tctx.drawImage(canvas, 0, y, canvasWidth, h, 0, 0, canvasWidth, h)

    const imgData = tmpCanvas.toDataURL('image/png', 1.0)

    // calculate height in mm for this slice
    const sliceHeightMm = (h * pdfWidth) / canvasWidth

    doc.addImage(imgData, 'PNG', marginMm, marginMm, pdfWidth, sliceHeightMm)

    y += h
    if(y < canvasHeight) doc.addPage()
  }
}

export async function generateNewsletterPDFClientSide(){
  // Collect DOM nodes in required order
  const selectors = []
  // 1) Hero Section (title + subtitle)
  const hero = document.querySelector('#inicio')
  if(hero) selectors.push(hero)

  // 2) Hero Quote
  const quote = document.querySelector('#hero-quote')
  if(quote) selectors.push(quote)

  // 3) All info blocks inside #boletin (keeps order)
  const boletin = document.querySelector('#boletin')
  if(boletin){
    const blocks = boletin.querySelectorAll('.info-block')
    blocks.forEach(b=>selectors.push(b))
  }

  // 4) Impact / stats area
  const stats = document.querySelector('#estadisticas')
  if(stats) selectors.push(stats)

  // 5) Members
  const members = document.querySelector('#miembros')
  if(members) selectors.push(members)

  if(selectors.length === 0){
    throw new Error('No se encontraron secciones para incluir en el PDF.')
  }

  // instantiate jsPDF (A4)
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

  const margin = 16
  let first = true

  for(const el of selectors){
    // snapshot element
    // temporarily expand width to printable width to make canvas clearer
    const originalStyle = {
      width: el.style.width,
      maxWidth: el.style.maxWidth
    }

    // ensure element width fits printable width (roughly)
    el.style.maxWidth = '900px'
    el.style.width = '900px'

    const canvas = await elementToCanvas(el, 2)

    // restore
    el.style.width = originalStyle.width
    el.style.maxWidth = originalStyle.maxWidth

    if(!first) doc.addPage()
    await addCanvasToPDF(doc, canvas, margin)
    first = false
  }

  // set metadata
  const now = new Date()
  const filename = `Pandor-AI_Boletin_${now.toISOString().slice(0,10)}.pdf`

  // save
  doc.save(filename)
}

export default generateNewsletterPDFClientSide
