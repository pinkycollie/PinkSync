/**
 * Example: Using DeafAUTH with Deno Fresh
 * 
 * This example shows how to integrate DeafAUTH into a Deno Fresh application.
 */

import { deafAuthService } from './mod.ts';

// Example 1: Simple authentication
async function exampleAuthentication() {
  console.log('=== Example 1: Authentication ===');
  
  const result = await deafAuthService.authenticate(
    { username: 'john.doe', password: 'password123' },
    { pattern: ['1', '2', '3', '4'], type: 'pattern-matching' }
  );
  
  if (result.success) {
    console.log('✓ Authentication successful');
    console.log('User:', result.user?.username);
    console.log('Token:', result.token);
    return result.token;
  } else {
    console.log('✗ Authentication failed:', result.error);
    return null;
  }
}

// Example 2: Token validation
async function exampleValidation(token: string | null) {
  if (!token) return;
  
  console.log('\n=== Example 2: Token Validation ===');
  
  const user = await deafAuthService.validateToken(token);
  
  if (user) {
    console.log('✓ Token is valid');
    console.log('User ID:', user.id);
    console.log('Preferences:', user.preferences);
  } else {
    console.log('✗ Token is invalid');
  }
}

// Example 3: Update preferences
async function exampleUpdatePreferences(token: string | null) {
  if (!token) return;
  
  console.log('\n=== Example 3: Update Preferences ===');
  
  const user = await deafAuthService.validateToken(token);
  if (!user) return;
  
  await deafAuthService.updatePreferences(user.id, {
    simplifyText: false,
    fontSize: 'large',
    colorScheme: 'dark',
  });
  
  // Verify update
  const updatedUser = await deafAuthService.validateToken(token);
  console.log('✓ Preferences updated');
  console.log('New fontSize:', updatedUser?.preferences.fontSize);
  console.log('New colorScheme:', updatedUser?.preferences.colorScheme);
}

// Example 4: Registration
async function exampleRegistration() {
  console.log('\n=== Example 4: User Registration ===');
  
  const result = await deafAuthService.register(
    { username: 'jane.smith', password: 'securepass456' },
    {
      email: 'jane.smith@example.com',
      displayName: 'Jane Smith',
      communicationPreferences: {
        preferredLanguage: 'en',
        textComplexity: 'simple',
        visualAids: true,
        captioning: true,
      },
    }
  );
  
  if (result.success) {
    console.log('✓ Registration successful');
    console.log('User:', result.user?.username);
  } else {
    console.log('✗ Registration failed:', result.error);
  }
}

// Example 5: Logout
async function exampleLogout(token: string | null) {
  if (!token) return;
  
  console.log('\n=== Example 5: Logout ===');
  
  await deafAuthService.logout(token);
  console.log('✓ User logged out');
  
  // Verify token is no longer valid
  const user = await deafAuthService.validateToken(token);
  console.log('Token still valid?', user !== null);
}

// Example 6: Session management
async function exampleSessionManagement() {
  console.log('\n=== Example 6: Session Management ===');
  
  // Create multiple sessions
  const user1 = await deafAuthService.authenticate(
    { username: 'user1', password: 'pass1' },
    { pattern: ['1', '2', '3'], type: 'pattern-matching' }
  );
  
  const user2 = await deafAuthService.authenticate(
    { username: 'user2', password: 'pass2' },
    { pattern: ['4', '5', '6'], type: 'pattern-matching' }
  );
  
  console.log('Active sessions:', deafAuthService.getSessionCount());
  
  // Clear all sessions
  deafAuthService.clearAllSessions();
  console.log('Sessions after clear:', deafAuthService.getSessionCount());
}

// Run all examples
async function runAllExamples() {
  const token = await exampleAuthentication();
  await exampleValidation(token);
  await exampleUpdatePreferences(token);
  await exampleRegistration();
  await exampleLogout(token);
  await exampleSessionManagement();
  
  console.log('\n=== All Examples Complete ===');
}

// Execute if run directly
if (import.meta.main) {
  await runAllExamples();
}

// Export for testing
export { runAllExamples };
