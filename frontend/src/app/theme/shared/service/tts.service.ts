import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  private http = inject(HttpClient);
  private audio: HTMLAudioElement | null = null;
  private currentBlobUrl: string | null = null;

  /**
   * Play text using the internal natural-sounding TTS API.
   * API URL: /api-tts/tts (Proxied via Nginx to the tts container)
   * POST body: { "text": "..." }
   */
  speak(text: string): void {
    if (!text) return;

    this.stopAudio();

    const ttsUrl = `/api-tts/tts`;

    this.http.post<any>(ttsUrl, { text }).subscribe({
      next: (res) => {
        let base64 = res.base64_audio;

        if (!base64) {
          console.warn('[TtsService] No audio data received, using fallback.');
          this.fallbackToNative(text);
          return;
        }

        // Nếu có prefix (data:audio/wav;base64,...) thì loại bỏ
        if (base64.includes(',')) {
          base64 = base64.split(',')[1];
        }

        const blob = this.base64ToBlob(base64, 'audio/wav');

        this.currentBlobUrl = URL.createObjectURL(blob);
        this.audio = new Audio(this.currentBlobUrl);

        this.audio.play().catch(err => {
          console.error('[TtsService] Audio playback failed:', err);
          this.fallbackToNative(text);
        });

        this.audio.onended = () => {
          this.cleanupBlob();
        };
      },
      error: (err) => {
        console.error('[TtsService] TTS API call failed:', err);
        this.fallbackToNative(text);
      }
    });
  }

  private stopAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    this.cleanupBlob();
  }

  private cleanupBlob(): void {
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
  }

  private fallbackToNative(text: string): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.volume = 1;
      utterance.rate = 0.85;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }
  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
  }
}
