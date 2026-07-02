let drawCount = 0

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#drawForm")

  const quantityInput = document.querySelector("#quantity")
  const minInput = document.querySelector("#of")
  const maxInput = document.querySelector("#until")
  const noRepeatInput = document.querySelector("#noRepeat")

  const errorMessage = document.querySelector("#errorMessage")

  const drawSection = document.querySelector("#drawSection")
  const resultSection = document.querySelector("#resultSection")
  const resultCount = document.querySelector("#resultCount")
  const resultStage = document.querySelector("#resultStage")
  const resultList = document.querySelector("#resultList")
  const reSorterButton = document.querySelector("#reSorter")

  form.addEventListener("submit", handleDraw)

         quantityInput.addEventListener("input", () => {
  if (Number(quantityInput.value) > 9) {
    quantityInput.value = 9
  }
}) 
  reSorterButton.addEventListener("click", () => {
    form.requestSubmit()
  })

  function handleDraw(event) {
    event.preventDefault()   

    const drawData = getDrawData()
    const error = validateDrawData(drawData)



    if (error) {
      showError(error)
      return
    }

    hideError()

    const numbers = generateRandomNumbers(drawData)

    drawCount++
    resultCount.textContent = drawCount

    drawSection.classList.add("is-hidden")
    resultSection.classList.remove("is-hidden")

    animateNumbers(numbers)
  }

  function getDrawData() {
    return {
      quantity: Number(quantityInput.value),
      min: Number(minInput.value),
      max: Number(maxInput.value),
      noRepeat: noRepeatInput.checked,
      quantityRaw: quantityInput.value.trim(),
      minRaw: minInput.value.trim(),
      maxRaw: maxInput.value.trim(),
    }
  }

  function validateDrawData(drawData) {
    const { quantity, min, max, noRepeat, quantityRaw, minRaw, maxRaw } = drawData

    if (!quantityRaw || !minRaw || !maxRaw) {
      return "Preencha todos os campos antes de sortear."
    }

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

    const availableNumbers = max - min + 1

    if (noRepeat && quantity > availableNumbers) {
      return `Não dá para sortear ${quantity} números sem repetir dentro de um intervalo com apenas ${availableNumbers} números.`
    }

    return null
  }

  function generateRandomNumbers(drawData) {
    const { quantity, min, max, noRepeat } = drawData

    if (noRepeat) {
      return generateUniqueNumbers(quantity, min, max)
    }

    return generateNumbersWithRepeat(quantity, min, max)
  }

  function generateNumbersWithRepeat(quantity, min, max) {
    const numbers = []

    for (let i = 0; i < quantity; i++) {
      const randomNumber = getRandomNumber(min, max)
      numbers.push(randomNumber)
    }

    return numbers
  }

  function generateUniqueNumbers(quantity, min, max) {
    const availableNumbers = []

    for (let number = min; number <= max; number++) {
      availableNumbers.push(number)
    }

    const drawnNumbers = []

    for (let i = 0; i < quantity; i++) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length)
      const [drawnNumber] = availableNumbers.splice(randomIndex, 1)

      drawnNumbers.push(drawnNumber)
    }

    return drawnNumbers
  }

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

  function animateNumbers(numbers) {
    const values = Array.isArray(numbers) ? numbers : [numbers]

    resultList.innerHTML = ""

    resultStage.classList.remove("is-animating")
    void resultStage.offsetWidth
    resultStage.classList.add("is-animating")

    const trailAmount = 11
    const trailDuration = 1350

    values.forEach((number, numberIndex) => {
      const slot = document.createElement("li")
      slot.className = "number-slot"

      for (let i = 0; i < trailAmount; i++) {
        const progress = i / (trailAmount - 1)

        const trailNumber = document.createElement("span")
        trailNumber.className = "result-number is-trail"
        trailNumber.textContent = number

        const y = -360 + progress * 310

        const x =
          Math.sin(progress * Math.PI * 3.2) * 38 +
          Math.sin(progress * Math.PI * 1.3) * 18

        const rotation = Math.sin(progress * Math.PI * 4) * 22
        const scale = 0.62 + progress * 0.32
        const opacity = 0.15 + progress * 0.7
        const blur = 8 - progress * 7

        const delay = i * 35 + numberIndex * 120

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
reSorterButton.addEventListener("click", () => {
  form.requestSubmit()
})