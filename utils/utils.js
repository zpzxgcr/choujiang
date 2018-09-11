function throwIfMissing() {
  throw new Error('Missing parameter');
}

/**
 * paragraph
 * x
 * y
 * color
 * fontSize
 * shadow
 * lineHeight
 * align
 * textBaseline
 * width
 * padding
 */

function drawParagraph(ctx = throwIfMissing(), {
  paragraph = '', x = 0, y = 0, color = '#000', fontSize = 12, shadow, lineHeight = 12 * 1.4, align = 'left', textBaseline = 'top',
  width = throwIfMissing(), padding = 0
} = {}) {
  width = width - padding * 2;
  lineHeight = lineHeight ? (lineHeight <= fontSize ? fontSize : lineHeight) : fontSize * 1.4;
  const lineCount = Math.floor(width / fontSize);
  const wordLength = [...paragraph].length;
  const wordArr = Array.apply(null, { length: Math.ceil(wordLength / lineCount) }).map((item ,index) => {
    return paragraph.substr(lineCount * index, lineCount);
  });
  (align === 'left') && (x = x + padding);
  wordArr.forEach((item, index) => {
    drawWord(ctx, {
      word: item, x: x, y: (y + (lineHeight - fontSize) * 0.4 + lineHeight * index),
      color, fontSize, shadow, align, textBaseline
    });
  });
}

function drawWord(ctx = throwIfMissing(), {
  word = '', x = 0, y = 0, color = '#000', fontSize = 12, shadow, align = 'left', textBaseline = 'top'
} = {}) {
  ctx.save();
  ctx.beginPath();
  ctx.setFillStyle(color);
  ctx.setTextAlign(align);
  ctx.setTextBaseline(textBaseline);
  ctx.setFontSize(fontSize);
  if (shadow) {
    ctx.setShadow(shadow.x, shadow.y, shadow.blur, shadow.color);
  }
  ctx.fillText(word, x, y);
  ctx.restore();
}

function roundRect(ctx = throwIfMissing(), {
  x, y, w, h, r = 0, backgroundColor = '#fff', image
}) {
  if (w < 2 * r || h < 2 * r) {
    r = (w <= h ? w : h) / 2
  }
  ctx.save();
  ctx.beginPath();
  ctx.setFillStyle(backgroundColor);
  ctx.moveTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);

  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);

  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);

  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);

  ctx.closePath();
  ctx.fill();
  ctx.clip();
  image && ctx.drawImage(image, x, y, w, h);
  ctx.restore();
}

function roundCircle(ctx = throwIfMissing(), {
  x, y, r, backgroundColor = '#fff', image
}) {
  ctx.save();
  ctx.beginPath();
  ctx.setFillStyle(backgroundColor);
  ctx.arc(x+r, y+r, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.clip();
  image && ctx.drawImage(image, x, y, 2*r, 2*r);
  ctx.restore();
}

module.exports = {
  throwIfMissing,
  drawParagraph, drawWord, roundRect, roundCircle
};
