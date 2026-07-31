const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function writeWavFile(filename, sampleRate, numChannels, samples) {
  const bytesPerSample = 2; // 16-bit PCM
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write sample data
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    let sample = Math.max(-1, Math.min(1, samples[i]));
    let val = sample < 0 ? sample * 32768 : sample * 32767;
    buffer.writeInt16LE(Math.round(val), offset);
    offset += 2;
  }

  fs.writeFileSync(path.join(outputDir, filename), buffer);
  console.log(`Generated: ${filename}`);
}

const sampleRate = 22050;
const durationSec = 8; // 8 second seamless loop
const totalSamples = sampleRate * durationSec;

// 1. forest_breeze.wav (Nature & Ambient - forest ambience birds wind)
{
  const samples = new Float32Array(totalSamples * 2);
  let lastOutL = 0, lastOutR = 0;
  for (let i = 0; i < totalSamples; i++) {
    // Soft Brownian wind
    const whiteL = Math.random() * 2 - 1;
    const whiteR = Math.random() * 2 - 1;
    lastOutL = (lastOutL + 0.03 * whiteL) / 1.03;
    lastOutR = (lastOutR + 0.03 * whiteR) / 1.03;
    const lfo = 0.5 + 0.5 * Math.sin((2 * Math.PI * i) / (sampleRate * 4));
    let sampleL = lastOutL * 1.5 * lfo;
    let sampleR = lastOutR * 1.5 * lfo;

    // Birdsong chirp at 2s and 5s
    const timeSec = i / sampleRate;
    if ((timeSec > 2.0 && timeSec < 2.3) || (timeSec > 5.5 && timeSec < 5.85)) {
      const freq = 2200 + Math.sin(timeSec * 40) * 400;
      const env = Math.sin(((timeSec % 3.5) - 2.0) * Math.PI / 0.35);
      const chirp = Math.sin(2 * Math.PI * freq * timeSec) * Math.max(0, env) * 0.15;
      sampleL += chirp;
      sampleR += chirp * 0.8;
    }

    samples[i * 2] = sampleL * 0.7;
    samples[i * 2 + 1] = sampleR * 0.7;
  }
  writeWavFile('forest_breeze.wav', sampleRate, 2, samples);
}

// 2. late_night_library.wav (Lo-Fi Study - lofi study chill instrumental)
{
  const samples = new Float32Array(totalSamples * 2);
  const chords = [
    [220.00, 261.63, 329.63, 392.00], // Am7
    [146.83, 261.63, 349.23, 440.00], // Dm7
    [196.00, 246.94, 349.23, 392.00], // G7
    [130.81, 246.94, 329.63, 392.00]  // Cmaj7
  ];
  for (let i = 0; i < totalSamples; i++) {
    const timeSec = i / sampleRate;
    const chordIdx = Math.floor((timeSec / durationSec) * 4) % 4;
    const chord = chords[chordIdx];
    const stepTime = timeSec % 2.0;

    let tone = 0;
    for (let f = 0; f < chord.length; f++) {
      const freq = chord[f];
      const env = Math.exp(-stepTime * 1.2);
      tone += Math.sin(2 * Math.PI * freq * timeSec) * env * 0.12;
      tone += Math.sin(2 * Math.PI * (freq * 2) * timeSec) * env * 0.04;
    }

    // Soft vinyl crackle
    const crackle = (Math.random() * 2 - 1) * (Math.random() < 0.05 ? 0.04 : 0.005);
    const sampleL = tone + crackle;
    const sampleR = tone * 0.95 + crackle;

    samples[i * 2] = sampleL * 0.8;
    samples[i * 2 + 1] = sampleR * 0.8;
  }
  writeWavFile('late_night_library.wav', sampleRate, 2, samples);
}

// 3. alpha_wave_focus.wav (Binaural Focus - alpha binaural focus)
{
  const samples = new Float32Array(totalSamples * 2);
  for (let i = 0; i < totalSamples; i++) {
    const timeSec = i / sampleRate;
    // Left channel = 200 Hz, Right channel = 210 Hz (10 Hz Alpha beat)
    const leftTone = Math.sin(2 * Math.PI * 200 * timeSec) * 0.35;
    const rightTone = Math.sin(2 * Math.PI * 210 * timeSec) * 0.35;
    // Warm sub drone 70 Hz
    const subDrone = Math.sin(2 * Math.PI * 70 * timeSec) * 0.15;

    samples[i * 2] = (leftTone + subDrone) * 0.8;
    samples[i * 2 + 1] = (rightTone + subDrone) * 0.8;
  }
  writeWavFile('alpha_wave_focus.wav', sampleRate, 2, samples);
}

// 4. brown_noise_blanket.wav (White Noise - brown noise 1 hour)
{
  const samples = new Float32Array(totalSamples * 2);
  let lastOutL = 0, lastOutR = 0;
  for (let i = 0; i < totalSamples; i++) {
    const whiteL = Math.random() * 2 - 1;
    const whiteR = Math.random() * 2 - 1;
    lastOutL = (lastOutL + 0.02 * whiteL) / 1.02;
    lastOutR = (lastOutR + 0.02 * whiteR) / 1.02;

    samples[i * 2] = lastOutL * 2.5;
    samples[i * 2 + 1] = lastOutR * 2.5;
  }
  writeWavFile('brown_noise_blanket.wav', sampleRate, 2, samples);
}

// 5. soft_keys_for_study.wav (Piano - relaxing piano study)
{
  const samples = new Float32Array(totalSamples * 2);
  const pianoNotes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 349.23];
  for (let i = 0; i < totalSamples; i++) {
    const timeSec = i / sampleRate;
    const noteIdx = Math.floor(timeSec / 1.0) % pianoNotes.length;
    const freq = pianoNotes[noteIdx];
    const noteTime = timeSec % 1.0;

    const env = Math.exp(-noteTime * 2.5);
    // Fundamental + harmonics
    let tone = Math.sin(2 * Math.PI * freq * timeSec) * 0.3 * env;
    tone += Math.sin(2 * Math.PI * freq * 2 * timeSec) * 0.1 * env;
    tone += Math.sin(2 * Math.PI * freq * 3 * timeSec) * 0.03 * env;

    samples[i * 2] = tone * 0.8;
    samples[i * 2 + 1] = tone * 0.8;
  }
  writeWavFile('soft_keys_for_study.wav', sampleRate, 2, samples);
}

console.log('All 5 audio loops generated successfully!');
