<script lang="ts">
  import { onMount } from 'svelte';
  import FlashCard from '$lib/components/FlashCard.svelte';
  import CardNavigation from '$lib/components/CardNavigation.svelte';
  import { loadFlashcardsFromTSV, shuffleCards } from '$lib/utils';
  import type { Flashcard } from '$lib/types';

  let cards: Flashcard[] = [];
  let currentIndex = 0;
  let loading = true;
  let error: string | null = null;
  let showNotes = true; // 常に備考を表示

  onMount(async () => {
    try {
      // 相対パスで指定して、ベースパスが適用されるようにする
      cards = await loadFlashcardsFromTSV('./data/flashcards.tsv');
      // 初期表示時にカードをシャッフルする
      cards = shuffleCards(cards);
      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : '不明なエラーが発生しました';
      loading = false;
    }
  });

  function handleNavigate(event: CustomEvent) {
    const { direction } = event.detail;
    if (direction === 'next' && currentIndex < cards.length - 1) {
      currentIndex++;
    } else if (direction === 'previous' && currentIndex > 0) {
      currentIndex--;
    }
  }

  // 備考は常に表示するため、この関数はコメントアウト
  // function handleToggleNotes() {
  //   showNotes = !showNotes;
  // }

  function handleShuffle() {
    cards = shuffleCards(cards);
    currentIndex = 0;
  }
</script>

<div class="flex flex-col items-center">
  <div class="w-full max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">英会話フラッシュカード</h2>
    
    {#if loading}
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    {:else if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">エラー:</strong>
        <span class="block sm:inline">{error}</span>
        <p class="mt-2">TSVファイルが正しく読み込めませんでした。ファイルの形式を確認してください。</p>
      </div>
    {:else if cards.length === 0}
      <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">注意:</strong>
        <span class="block sm:inline">カードが見つかりませんでした。</span>
        <p class="mt-2">TSVファイルに問題、回答、備考の列が含まれているか確認してください。</p>
      </div>
    {:else}
      <div class="mb-8">
        <FlashCard card={cards[currentIndex]} showNote={showNotes} />
      </div>
      
      <CardNavigation 
        currentIndex={currentIndex} 
        totalCards={cards.length} 
        showNotes={showNotes}
        on:navigate={handleNavigate}
        on:shuffle={handleShuffle}
      />
    {/if}
  </div>
</div>
