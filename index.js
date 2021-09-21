(() => {
    window.addEventListener('load', function () {
        const elements = document.querySelectorAll('.convert')
        elements.forEach((element) => renderIDSInElement(element))
        
        const $input = document.getElementById('input');
        const $output = document.getElementById('output');
        function updateOutput() {
            $output.innerText = $input.value;
            renderIDSInElement($output);
        }

        $input.addEventListener('input', updateOutput)
        updateOutput()
    })

    const idcs = {
        '⿰': [[0, 0, 1/2, 1], [1/2, 0, 1/2, 1]],
        '⿱': [[0, 0, 1, 1/2], [0, 1/2, 1, 1/2]],
        '⿲': [[0, 0, 1/3, 1], [1/3, 0, 1/3, 1], [2/3, 0, 1/3, 1]],
        '⿳': [[0, 0, 1, 1/3], [0, 1/3, 1, 1/3], [0, 2/3, 1, 1/3]],
        '⿴': [[0, 0, 1, 1], [2/10, 2/10, 6/10, 6/10]],
        '⿵': [[0, 0, 1, 1], [2/10, 2/10, 6/10, 8/10]],
        '⿶': [[0, 0, 1, 1], [2/10, 0, 6/10, 8/10]],
        '⿷': [[0, 0, 1, 1], [2/10, 2/10, 6/10, 8/10]],
        '⿸': [[0, 0, 1, 1], [2/10, 2/10, 8/10, 8/10]],
        '⿹': [[0, 0, 1, 1], [0, 2/10, 8/10, 8/10]],
        '⿺': [[0, 0, 1, 1], [2/10, 0, 8/10, 8/10]],
        '⿻': [[0, 0, 1, 1], [0, 0, 1, 1]],
    }
    const FONT = '"Noto Sans CJK KR"'
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 256
    canvas.height = 256
    function renderIDSInElement(element) {
        if(element.nodeType == Node.TEXT_NODE) {
            const result = []
            let text = ''
            for(let i = 0; i < element.nodeValue.length; ) {
                const c = element.nodeValue.charAt(i)
                if(Object.keys(idcs).includes(c)) {
                    if(text) result.push(document.createTextNode(text))
                    text = ''
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    ctx.save()
                    ctx.translate(0, canvas.height/32)
                    const len = renderIDS(ctx, element.nodeValue.slice(i))
                    ctx.restore()
                    const img = document.createElement('img')
                    img.classList.add('ids')
                    img.src = canvas.toDataURL()
                    img.alt = element.nodeValue.slice(i, i + len)
                    result.push(img)
                    i += len
                } else {
                    text += c
                    i += 1
                }
            }
            if(text) result.push(document.createTextNode(text))
            result.forEach((e) => element.parentNode.insertBefore(e, element))
            element.parentNode.removeChild(element)
        } else {
            element.childNodes.forEach((child) => renderIDSInElement(child))
        }
    }
    function renderIDS(ctx, string) {
        const c = string.charAt(0)
        const size = ctx.canvas.height
        if(Object.keys(idcs).includes(c)) {
            return idcs[c].reduce((acc, [x, y, w, h]) => {
                ctx.save()
                ctx.translate(x*size, y*size)
                ctx.scale(w, h)
                const result = renderIDS(ctx, string.slice(1 + acc))
                ctx.restore()
                return acc + result
            }, 0) + 1
        } else {
            ctx.font = `${size}px ${FONT}`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(c, size/2, size/2)
            return 1
        }
    }
})()
