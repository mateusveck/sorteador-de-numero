// Contador global: quantas vezes o usuário já sorteou nesta sessão
let drawCount = 0
// Espera o HTML carregar antes de buscar elementos e registrar eventos
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#drawForm")
  // Referências aos campos do formulário
  const quantityInput = document.querySelector("#quantity")
  const minInput = document.querySelector("#of")
  const maxInput = document.querySelector("#until")
  const noRepeatInput = document.querySelector("#noRepeat")
  const errorMessage = document.querySelector("#errorMessage")
  // Elementos da interface de resultado
  const drawSection = document.querySelector("#drawSection")
  const resultSection = document.querySelector("#resultSection")
  const resultCount = document.querySelector("#resultCount")
  const resultStage = document.querySelector("#resultStage")
  const resultList = document.querySelector("#resultList")
  const reSorterButton = document.querySelector("#reSorter")
  // Ao clicar em "Sortear", dispara handleDraw em vez de recarregar a página
  form.addEventListener("submit", handleDraw)
  // Limita a quantidade em tempo real enquanto o usuário digita
  quantityInput.addEventListener("input", () => {
    if (Number(quantityInput.value) > 9) {
      quantityInput.value = 9
    }
  })
  // "Sortear novamente" reenvia o formulário com os mesmos valores
  reSorterButton.addEventListener("click", () => {
    form.requestSubmit()
  })
  // Função principal: valida, sorteia e mostra o resultado
  function handleDraw(event) {
    event.preventDefault()
    const drawData = getDrawData()
    const error = validateDrawData(drawData)
    // Se houver erro de validação, exibe a mensagem e interrompe o sorteio
    if (error) {
      showError(error)
      return
    }
    hideError()
    const numbers = generateRandomNumbers(drawData)
    // Incrementa o contador e atualiza "1º resultado", "2º resultado"...
    drawCount++
    resultCount.textContent = drawCount
    // Troca a tela do formulário pela tela de resultados
    drawSection.classList.add("is-hidden")
    resultSection.classList.remove("is-hidden")
    animateNumbers(numbers)
  }
  // Lê os inputs e monta um objeto com valores numéricos e texto original
  function getDrawData() {
    return {
      quantity: Number(quantityInput.value),
      min: Number(minInput.value),
      max: Number(maxInput.value),
      noRepeat: noRepeatInput.checked,
      // Valores em texto servem para detectar campos vazios
      quantityRaw: quantityInput.value.trim(),
      minRaw: minInput.value.trim(),
      maxRaw: maxInput.value.trim(),
    }
  }
  // Valida os dados; retorna mensagem de erro ou null se estiver tudo certo
  function validateDrawData(drawData) {
    const { quantity, min, max, noRepeat, quantityRaw, minRaw, maxRaw } = drawData
    if (!quantityRaw || !minRaw || !maxRaw) {
      return "Preencha todos os campos antes de sortear."
    }
    // Number("1.5") vira 1.5; Number.isInteger garante números inteiros
    if (!Number.isInteger(quantity) || !Number.isInteger(min) || !Number.isInteger(max)) {
      return "Digite apenas números inteiros."
    }
    if (quantity <= 0) {
      return "A quantidade de números precisa ser maior que zero."
    }
    if (quantity > 9) {
      return "Você pode sortear no máximo 9 números por vez."
    }
    if (max <= min) {
      return "O valor máximo precisa ser maior que o valor mínimo."
    }
    // Quantos números existem no intervalo (ex.: de 1 a 10 = 10 números)
    const availableNumbers = max - min + 1
    // Sem repetição, não dá para sortear mais números do que existem no intervalo
    if (noRepeat && quantity > availableNumbers) {
      return `Não dá para sortear ${quantity} números sem repetir dentro de um intervalo com apenas ${availableNumbers} números.`
    }
    return null
  }
  // Escolhe a estratégia de sorteio conforme o checkbox "Não repetir número"
  function generateRandomNumbers(drawData) {
    const { quantity, min, max, noRepeat } = drawData
    if (noRepeat) {
      return generateUniqueNumbers(quantity, min, max)
    }
    return generateNumbersWithRepeat(quantity, min, max)
  }
  // Sorteia com repetição: cada número é independente
  function generateNumbersWithRepeat(quantity, min, max) {
    const numbers = []
    for (let i = 0; i < quantity; i++) {
      const randomNumber = getRandomNumber(min, max)
      numbers.push(randomNumber)
    }
    return numbers
  }
  // Sorteia sem repetição: remove cada número escolhido do pool disponível
  function generateUniqueNumbers(quantity, min, max) {
    const availableNumbers = []
    // Monta o "baralho" com todos os números do intervalo
    for (let number = min; number <= max; number++) {
      availableNumbers.push(number)
    }
    const drawnNumbers = []
    for (let i = 0; i < quantity; i++) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length)
      // splice remove o item e retorna um array; desestruturação pega o primeiro
      const [drawnNumber] = availableNumbers.splice(randomIndex, 1)
      drawnNumbers.push(drawnNumber)
    }
    return drawnNumbers
  }
  // Gera um inteiro aleatório entre min e max (inclusive)
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  function showError(message) {
    errorMessage.textContent = message
    errorMessage.classList.remove("hidden")
  }
  function hideError() {
    errorMessage.textContent = ""
    errorMessage.classList.add("hidden")
  }
  // Cria a animação visual dos números sorteados
  function animateNumbers(numbers) {
    const values = Array.isArray(numbers) ? numbers : [numbers]
    // Limpa resultados anteriores
    resultList.innerHTML = ""
    // Reinicia a animação CSS: remove, força reflow, adiciona de novo
    resultStage.classList.remove("is-animating")
    void resultStage.offsetWidth
    resultStage.classList.add("is-animating")
    const trailAmount = 11
    const trailDuration = 1350
    // Um <li> por número sorteado
    values.forEach((number, numberIndex) => {
      const slot = document.createElement("li")
      slot.className = "number-slot"
      // Vários spans formam o "rastro" do número caindo
      for (let i = 0; i < trailAmount; i++) {
        const progress = i / (trailAmount - 1)
        const trailNumber = document.createElement("span")
        trailNumber.className = "result-number is-trail"
        trailNumber.textContent = number
        // Posição e efeitos visuais ao longo da animação (0 a 1)
        const y = -360 + progress * 310
        const x =
          Math.sin(progress * Math.PI * 3.2) * 38 +
          Math.sin(progress * Math.PI * 1.3) * 18
        const rotation = Math.sin(progress * Math.PI * 4) * 22
        const scale = 0.62 + progress * 0.32
        const opacity = 0.15 + progress * 0.7
        const blur = 8 - progress * 7
        // Atraso escalonado: rastro interno + deslocamento entre números
        const delay = i * 35 + numberIndex * 120
        // CSS custom properties consumidas pelo style.css
        trailNumber.style.setProperty("--x", `${x}px`)
        trailNumber.style.setProperty("--y", `${y}px`)
        trailNumber.style.setProperty("--rotation", `${rotation}deg`)
        trailNumber.style.setProperty("--scale", scale)
        trailNumber.style.setProperty("--opacity", opacity)
        trailNumber.style.setProperty("--blur", `${blur}px`)
        trailNumber.style.setProperty("--delay", `${delay}ms`)
        slot.appendChild(trailNumber)
      }
      resultList.appendChild(slot)
    })
    // Após o rastro, substitui pelos números finais
    setTimeout(() => {
      const slots = resultList.querySelectorAll(".number-slot")
      slots.forEach((slot, index) => {
        slot.innerHTML = ""
        const finalNumber = document.createElement("span")
        finalNumber.className = "result-number is-final"
        finalNumber.textContent = values[index]
        finalNumber.style.animationDelay = `${index * 90}ms`
        slot.appendChild(finalNumber)
      })
    }, trailDuration)
    setTimeout(() => {
      resultStage.classList.remove("is-animating")
    }, trailDuration + 900)
  }
})