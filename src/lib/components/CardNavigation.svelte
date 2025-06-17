<!-- CardNavigation.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let currentIndex: number;
  export let totalCards: number;
  export let showNotes = false;
  
  const dispatch = createEventDispatcher();
  
  function goToPrevious() {
    if (currentIndex > 0) {
      dispatch('navigate', { direction: 'previous' });
    }
  }
  
  function goToNext() {
    if (currentIndex < totalCards - 1) {
      dispatch('navigate', { direction: 'next' });
    }
  }
  
  // 備考は常に表示するため、この関数はコメントアウト
  // function toggleNotes() {
  //   dispatch('toggleNotes');
  // }
  
  function shuffleCards() {
    dispatch('shuffle');
  }
</script>

<div class="flex flex-col items-center mt-6 w-full max-w-xl mx-auto">
  <!-- 進捗表示 -->
  <div class="w-full mb-4 flex items-center justify-between">
    <span class="text-sm text-gray-600">
      {currentIndex + 1} / {totalCards}
    </span>
    <div class="flex-grow mx-4">
      <div class="h-2 bg-gray-200 rounded-full">
        <div 
          class="h-2 bg-blue-500 rounded-full" 
          style="width: {((currentIndex + 1) / totalCards) * 100}%"
        ></div>
      </div>
    </div>
    <button 
      on:click={shuffleCards}
      class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
      aria-label="カードをシャッフル"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      シャッフル
    </button>
  </div>
  
  <!-- ナビゲーションボタン -->
  <div class="flex justify-between items-center w-full">
    <button 
      on:click={goToPrevious} 
      class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center {currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
      disabled={currentIndex === 0}
      aria-label="前のカードへ"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      前へ
    </button>
    
    <!-- 備考表示ボタンをコメントアウト -->
    <!-- 
    <button 
      on:click={toggleNotes} 
      class="px-4 py-2 {showNotes ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'} hover:bg-yellow-200 rounded-lg"
      aria-label={showNotes ? '備考を非表示' : '備考を表示'}
    >
      {showNotes ? '備考を非表示' : '備考を表示'}
    </button>
    -->
    
    <button 
      on:click={goToNext} 
      class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center {currentIndex === totalCards - 1 ? 'opacity-50 cursor-not-allowed' : ''}"
      disabled={currentIndex === totalCards - 1}
      aria-label="次のカードへ"
    >
      次へ
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</div>
