<!-- FlashCard.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
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
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-4">回答</h2>
      <p class="text-xl text-center text-gray-700 mb-4">{card.answer}</p>
      
      {#if showNote && card.note}
        <div class="mt-auto">
          <h3 class="text-lg font-semibold text-gray-700">備考:</h3>
          <p class="text-gray-600 italic">{card.note}</p>
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
