

domOn('.rectangle1', 'click', async evt => {
    const btn = evt.currentTarget;
    if (btn.style.fill === 'red') {
        btn.style.fill = 'blue';   
      }
      else btn.style.fill = 'red';
    }
)

domOn('.circle1', 'mousemove', async evt => {
    const btn = evt.currentTarget;
    if (btn.style.r === '60') {
        btn.style.r = '100';   
      }
      else btn.style.r = '60';
    }
)

function domForEach(selector, callback) {
    document.querySelectorAll(selector).forEach(callback);
}

function domOn(selector, event, callback) {
    domForEach(selector, ele => ele.addEventListener(event, callback));
}