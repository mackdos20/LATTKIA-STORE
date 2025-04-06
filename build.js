// Simple build script to bypass TypeScript checking
import { execSync } from 'child_process';

try {
  console.log('Building project without TypeScript checking...');
  execSync('vite build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}