<!-- FlashCard.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { browser } from '$app/environment';
  import type { Flashcard } from '$lib/types';

  export let card: Flashcard;
  export let showNote = false;
  
  let flipped = false;
  let transitioning = false;
  let currentContent: 'question' | 'answer' = 'question';
  let timeRemaining = 30; // 30秒のカウントダウン
  let timerId: ReturnType<typeof setInterval> | null = null;
  let timerActive = false;
  
  const dispatch = createEventDispatcher();
  
  // タイマーを開始する関数
  function startTimer() {
    if (timerId) clearInterval(timerId);
    timeRemaining = 30;
    timerActive = true;
    
    timerId = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
      } else {
        stopTimer();
      }
    }, 1000);
  }
  
  // タイマーを停止する関数
  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    timerActive = false;
  }
  
  // 英語テキストを音声で読み上げる関数
  function speakText(text: string, event?: Event) {
    // イベントの伝播を停止（カードが反転しないようにする）
    if (event) {
      event.stopPropagation();
    }
    
    // ブラウザ環境でのみ実行
    if (browser && 'speechSynthesis' in window) {
      // 発話を停止
      window.speechSynthesis.cancel();
      
      // 新しい発話オブジェクトを作成
      const utterance = new SpeechSynthesisUtterance(text);
      
      // 英語の声を設定
      utterance.lang = 'en-US';
      
      // 速度を少し遅めに設定（0.9）
      utterance.rate = 0.9;
      
      // 発話開始
      window.speechSynthesis.speak(utterance);
    }
  }
  
  async function toggleFlip() {
    if (transitioning) return;
    
    transitioning = true;
    flipped = !flipped;
    
    // 遷移中はカードの内容を変更しない
    setTimeout(() => {
      currentContent = flipped ? 'answer' : 'question';
      transitioning = false;
      
      // 問題表示時にタイマーを開始、回答表示時に停止
      if (currentContent === 'question') {
        startTimer();
      } else {
        stopTimer();
      }
    }, 150); // フェードアウトが完了する前に内容を切り替える
    
    dispatch('flip', { flipped });
  }
  
  // カードが変わったときに必ず問題側を表示し、タイマーをリセット
  $: if (card) {
    flipped = false;
    currentContent = 'question';
    startTimer(); // 新しいカードが表示されたらタイマーを開始
  }
  
  // コンポーネントがマウントされたときにタイマーを開始
  onMount(() => {
    if (currentContent === 'question') {
      startTimer();
    }
  });
  
  // コンポーネントが破棄されるときにタイマーをクリア
  onDestroy(() => {
    if (timerId) clearInterval(timerId);
  });
</script>

<div 
  class="relative w-full max-w-xl h-64 md:h-80 mx-auto cursor-pointer bg-white rounded-xl shadow-lg"
  on:click={toggleFlip}
  on:keydown={(e) => e.key === 'Enter' && toggleFlip()}
  role="button"
  tabindex="0"
  aria-label={flipped ? '回答を隠す' : '回答を表示する'}
  aria-pressed={flipped}
>
  {#if !transitioning && currentContent === 'question'}
    <div 
      class="w-full h-full p-6 flex flex-col justify-center relative"
      in:fade={{ duration: 150, easing: cubicOut }}
      out:fade={{ duration: 150 }}
    >
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-4">問題</h2>
      <p class="text-xl text-center text-gray-700">{card.question}</p>
      
      {#if card.category}
        <div class="absolute bottom-2 right-3 text-xs text-gray-400">
          {card.category}
        </div>
      {/if}
      
      <!-- カウントダウンタイマー -->
      {#if timerActive}
        <div class="absolute top-3 right-3 flex items-center">
          <div class="text-sm font-medium
            {timeRemaining > 10 ? 'text-gray-500' : timeRemaining > 5 ? 'text-orange-500' : 'text-red-500'}"
          >
            {timeRemaining}秒
          </div>
        </div>
      {/if}
    </div>
  {:else if !transitioning && currentContent === 'answer'}
    <div 
      class="w-full h-full p-6 flex flex-col justify-center bg-blue-50"
      in:fade={{ duration: 150, easing: cubicOut }}
      out:fade={{ duration: 150 }}
    >
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-4">回答例</h2>
      <div class="flex justify-center items-center gap-2 mb-4">
        <p class="text-xl text-center text-gray-700">{card.answer}</p>
        <!-- 回答の音声ボタン -->
        <button 
          class="text-blue-500 hover:text-blue-700 focus:outline-none" 
          on:click={(e) => speakText(card.answer, e)}
          aria-label="回答を音声で再生"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>
      </div>
      
      {#if showNote && card.note}
        <div class="mt-auto">
          <h3 class="text-lg font-semibold text-gray-700">備考:</h3>
          <div class="flex items-start gap-2">
            <p class="text-gray-600 italic">{card.note}</p>
            <!-- 備考の音声ボタン -->
            <button 
              class="text-blue-500 hover:text-blue-700 focus:outline-none flex-shrink-0 mt-1" 
              on:click={(e) => speakText(card.note, e)}
              aria-label="備考を音声で再生"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <!-- 遷移中は空の要素を表示 -->
    <div class="w-full h-full p-6 flex flex-col justify-center">
      <!-- 何も表示しない -->
    </div>
  {/if}
</div>
