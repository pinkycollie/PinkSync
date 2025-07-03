// This script runs in a dedicated Web Worker

// Function to find prime numbers up to a given limit (a heavy computation)
function findPrimes(limit) {
  const primes = []
  for (let i = 2; i <= limit; i++) {
    let isPrime = true
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        isPrime = false
        break
      }
    }
    if (isPrime) {
      primes.push(i)
    }
  }
  return primes.length
}

// Listen for messages from the main thread
self.onmessage = (event) => {
  const limit = event.data
  console.log(`Worker: Starting prime calculation up to ${limit}...`)
  const numberOfPrimes = findPrimes(limit)
  console.log(`Worker: Finished calculation. Found ${numberOfPrimes} primes.`)

  // Send the result back to the main thread
  self.postMessage(`Found ${numberOfPrimes} prime numbers up to ${limit}.`)
}

console.log("Web Worker initialized.")
