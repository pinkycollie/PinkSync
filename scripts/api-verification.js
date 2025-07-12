// API Verification Suite for vCode.pinksync.io
const API_BASE_URL = "https://api.pinksync.io"

// Test configuration
const testConfig = {
  // Mock JWT token for testing (you'll need a real one)
  mockJWT:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNzMzNTU5MDMwLCJleHAiOjE3MzM2NDU0MzAsImlzcyI6Imh0dHBzOi8vZGVhZmF1dGgucGlua3N5bmMuaW8iLCJhdWQiOiJ2Y29kZS5waW5rc3luYy5pbyJ9",

  // Mock API key for service testing
  mockApiKey: "test-api-key-123",

  // Test data
  testSession: {
    clientId: "test-client-123",
    domain: "healthcare",
    context: "Patient consent verification",
    requiresHumanReview: false,
  },
}

// Utility functions
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  console.log(`🔍 Testing: ${options.method || "GET"} ${url}`)

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    const data = await response.text()
    let jsonData = null

    try {
      jsonData = JSON.parse(data)
    } catch (e) {
      jsonData = { rawResponse: data }
    }

    return {
      status: response.status,
      ok: response.ok,
      data: jsonData,
      headers: Object.fromEntries(response.headers.entries()),
    }
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
      data: null,
    }
  }
}

function logResult(testName, result, expected = null) {
  const status = result.ok ? "✅" : "❌"
  const statusCode = result.status || "ERROR"

  console.log(`${status} ${testName}`)
  console.log(`   Status: ${statusCode}`)

  if (result.data) {
    console.log(`   Response:`, JSON.stringify(result.data, null, 2))
  }

  if (result.error) {
    console.log(`   Error: ${result.error}`)
  }

  console.log("---")
}

// Test suite
async function runVerificationSuite() {
  console.log("🚀 Starting vCode API Verification Suite")
  console.log(`📍 Testing: ${API_BASE_URL}`)
  console.log("=".repeat(50))

  // Test 1: Health Check
  console.log("\n📊 HEALTH & STATUS TESTS")
  const healthResult = await makeRequest("/api/health")
  logResult("Health Check", healthResult)

  // Test 2: Landing Page
  const landingResult = await makeRequest("/")
  logResult("Landing Page", landingResult)

  // Test 3: CORS Headers
  const corsResult = await makeRequest("/api/health", {
    method: "OPTIONS",
  })
  logResult("CORS Preflight", corsResult)

  console.log("\n🔐 AUTHENTICATION TESTS")

  // Test 4: Auth verification without token (should fail)
  const noAuthResult = await makeRequest("/api/v2/auth/verify", {
    method: "POST",
  })
  logResult("No Auth Token (Expected 401)", noAuthResult)

  // Test 5: Auth verification with mock token
  const authResult = await makeRequest("/api/v2/auth/verify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${testConfig.mockJWT}`,
    },
  })
  logResult("JWT Auth Verification", authResult)

  // Test 6: API Key authentication
  const apiKeyResult = await makeRequest("/api/v2/auth/verify", {
    method: "POST",
    headers: {
      "X-PinkSync-Key": testConfig.mockApiKey,
      "X-Service-Name": "fibonrose-service",
    },
  })
  logResult("API Key Auth", apiKeyResult)

  console.log("\n📝 SESSION MANAGEMENT TESTS")

  // Test 7: Create session without auth (should fail)
  const noAuthSessionResult = await makeRequest("/api/v2/sessions/create", {
    method: "POST",
    body: JSON.stringify(testConfig.testSession),
  })
  logResult("Create Session No Auth (Expected 401)", noAuthSessionResult)

  // Test 8: Create session with auth
  const createSessionResult = await makeRequest("/api/v2/sessions/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${testConfig.mockJWT}`,
    },
    body: JSON.stringify(testConfig.testSession),
  })
  logResult("Create Session with Auth", createSessionResult)

  console.log("\n🔍 VCODE RETRIEVAL TESTS")

  // Test 9: Get non-existent vCode
  const nonExistentVCodeResult = await makeRequest("/api/v2/vcodes/VID-NONEXISTENT", {
    headers: {
      Authorization: `Bearer ${testConfig.mockJWT}`,
    },
  })
  logResult("Get Non-existent vCode (Expected 404)", nonExistentVCodeResult)

  console.log("\n👥 ADMIN TESTS")

  // Test 10: Admin endpoint without admin role (should fail)
  const adminResult = await makeRequest("/api/v2/admin/users", {
    headers: {
      Authorization: `Bearer ${testConfig.mockJWT}`,
    },
  })
  logResult("Admin Users List (Expected 403)", adminResult)

  console.log("\n📊 SUMMARY")
  console.log("=".repeat(50))

  // Check critical endpoints
  const criticalTests = [
    { name: "Health Check", result: healthResult },
    { name: "Landing Page", result: landingResult },
    { name: "Auth Endpoint", result: noAuthResult.status === 401 ? { ok: true } : { ok: false } },
  ]

  const passedCritical = criticalTests.filter((test) => test.result.ok).length
  const totalCritical = criticalTests.length

  console.log(`✅ Critical Tests Passed: ${passedCritical}/${totalCritical}`)

  if (passedCritical === totalCritical) {
    console.log("🎉 API is running correctly!")
    console.log("🔗 Service URL: https://vcode.pinksync.io")
    console.log("📚 Documentation: https://developers.pinksync.io/vcode")
  } else {
    console.log("⚠️  Some critical tests failed. Check deployment configuration.")
  }

  console.log("\n🔧 NEXT STEPS:")
  console.log("1. Set up proper JWT secrets and API keys")
  console.log("2. Configure database schema")
  console.log("3. Test with real authentication tokens")
  console.log("4. Set up monitoring and alerts")

  return {
    totalTests: 10,
    criticalPassed: passedCritical,
    allResults: {
      health: healthResult,
      landing: landingResult,
      cors: corsResult,
      auth: authResult,
      sessions: createSessionResult,
    },
  }
}

// Run the verification suite
runVerificationSuite()
  .then((results) => {
    console.log("\n✨ Verification Complete!")
  })
  .catch((error) => {
    console.error("❌ Verification failed:", error)
  })
