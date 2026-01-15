/**
 * Calculator Test
 * 
 * Tests the Integer Partitioning Engine with the SURGE structure.
 * Run with: npx tsx src/core/engine/calculator.test.ts
 */

import { calculateTimeline, validateTimelineSum, formatTimeline } from './calculator';
import { STRUCTURES } from '../structures/library';

// ============================================================================
// Test Case: SURGE with 60 seconds
// ============================================================================

console.log('\n');
console.log('═══════════════════════════════════════════════════════════════');
console.log('   INTEGER PARTITIONING ENGINE TEST');
console.log('═══════════════════════════════════════════════════════════════');
console.log('\n');

// Get the SURGE structure
const surgeStructure = STRUCTURES.SURGE;

console.log('📊 Input Structure: SURGE');
console.log('   Description:', surgeStructure.description);
console.log('   Total Duration: 60 seconds');
console.log('\n');

console.log('📐 Base Percentages:');
surgeStructure.segments.forEach((seg, i) => {
    console.log(`   [${i + 1}] ${seg.type.padEnd(8)} → ${seg.basePercentage}%`);
});
console.log('\n');

// Calculate the timeline
const timeline = calculateTimeline(60, surgeStructure);

// Display the results
console.log('📈 Calculated Timeline:');
console.log(formatTimeline(timeline));
console.log('\n');

// Validate the sum
const isValid = validateTimelineSum(timeline, 60);
const totalDuration = timeline.reduce((sum, seg) => sum + seg.duration, 0);

console.log('✅ Validation Results:');
console.log(`   Expected Total: 60 seconds`);
console.log(`   Actual Total:   ${totalDuration} seconds`);
console.log(`   Sum Valid:      ${isValid ? '✓ PASS' : '✗ FAIL'}`);
console.log('\n');

// Detailed breakdown
console.log('📋 Detailed Breakdown:');
timeline.forEach((seg, i) => {
    const expectedRaw = (surgeStructure.segments[i].basePercentage / 100) * 60;
    const diff = seg.duration - expectedRaw;
    console.log(
        `   ${seg.type.padEnd(8)} | ` +
        `Raw: ${expectedRaw.toFixed(2).padStart(5)}s | ` +
        `Final: ${seg.duration.toString().padStart(2)}s | ` +
        `Adjustment: ${diff >= 0 ? '+' : ''}${diff.toFixed(2)}s`
    );
});
console.log('\n');

// Test with edge cases
console.log('═══════════════════════════════════════════════════════════════');
console.log('   ADDITIONAL TEST CASES');
console.log('═══════════════════════════════════════════════════════════════');
console.log('\n');

// Test with different durations
const testDurations = [30, 45, 90, 120, 7, 13, 100];

testDurations.forEach(duration => {
    const result = calculateTimeline(duration, surgeStructure);
    const sum = result.reduce((acc, seg) => acc + seg.duration, 0);
    const valid = sum === duration;

    console.log(
        `   Duration: ${duration.toString().padStart(3)}s | ` +
        `Sum: ${sum.toString().padStart(3)}s | ` +
        `${valid ? '✓ PASS' : '✗ FAIL'} | ` +
        `Segments: [${result.map(s => s.duration).join(', ')}]`
    );
});

console.log('\n');
console.log('═══════════════════════════════════════════════════════════════');
console.log('   SMART HOOK CLAMPING TEST (TikTok)');
console.log('═══════════════════════════════════════════════════════════════');
console.log('\n');

// 60s SURGE on TikTok
// Standard: Hook ~9s, Build ~21s
// Clamped: Hook = 3s, Build = 21 + 6 = 27s
const tiktokTimeline = calculateTimeline(60, surgeStructure, 'TikTok');
const hook = tiktokTimeline.find(s => s.type === 'HOOK');
const build = tiktokTimeline.find(s => s.type === 'BUILD');

console.log(`   Platform: TikTok (Hook limit: 3s)`);
console.log(`   Hook Duration:  ${hook?.duration}s ${hook?.duration === 3 ? '✓ PASS' : '✗ FAIL'}`);
console.log(`   Build Duration: ${build?.duration}s ${build?.duration === 27 ? '✓ PASS' : '✗ FAIL'}`);
console.log(`   Total Sum:      ${tiktokTimeline.reduce((a, b) => a + b.duration, 0)}s ${validateTimelineSum(tiktokTimeline, 60) ? '✓ PASS' : '✗ FAIL'}`);


console.log('\n');
console.log('═══════════════════════════════════════════════════════════════');
console.log('   TEST COMPLETE');
console.log('═══════════════════════════════════════════════════════════════');
console.log('\n');

// Exit with appropriate code
if (!isValid) {
    process.exit(1);
}
