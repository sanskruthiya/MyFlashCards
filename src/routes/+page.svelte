<script lang="ts">
  import { onMount } from 'svelte';
  import FlashCard from '$lib/components/FlashCard.svelte';
  import CardNavigation from '$lib/components/CardNavigation.svelte';
  import { loadFlashcardsFromTSV, shuffleCards, getAvailableDatasets } from '$lib/utils';
  import type { Flashcard } from '$lib/types';

  let cards: Flashcard[] = [];
  let currentIndex = 0;
  let loading = true;
  let error: string | null = null;
  let showNotes = true; // 常に備考を表示
  
  // 利用可能なデータセット
  const datasets = getAvailableDatasets();
  // 選択中のデータセット（デフォルトは最初のデータセット）
  let selectedDataset = datasets[0].id;

  // データセットを読み込む関数
  async function loadSelectedDataset(datasetId: string) {
    loading = true;
    error = null;
    try {
      // 相対パスで指定して、ベースパスが適用されるようにする
      cards = await loadFlashcardsFromTSV(`./data/${datasetId}`);
      // カードをシャッフルする
      cards = shuffleCards(cards);
      currentIndex = 0; // カードインデックスをリセット
      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : '不明なエラーが発生しました';
      loading = false;
    }
  }

  // データセット選択が変更されたときの処理
  function handleDatasetChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    selectedDataset = select.value;
    loadSelectedDataset(selectedDataset);
  }

  onMount(() => {
    // 初期データセットを読み込む
    loadSelectedDataset(selectedDataset);
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
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">英会話用フラッシュカード</h2>
    
    <!-- データセット選択ドロップダウン -->
    <div class="mb-6">
      <div class="mb-2">
        <label for="dataset-select" class="block text-sm font-medium text-gray-700 mb-1">データセットを選択:</label>
        <select 
          id="dataset-select" 
          class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
          value={selectedDataset} 
          on:change={handleDatasetChange}
        >
          {#each datasets as dataset}
            <option value={dataset.id}>{dataset.title}</option>
          {/each}
        </select>
      </div>
      
      <!-- 選択中のデータセットの説明 -->
      {#if selectedDataset}
        <div class="text-sm text-gray-600 mb-4">
          {datasets.find(d => d.id === selectedDataset)?.description}
        </div>
      {/if}
    </div>

    {#if loading}
      <div class="flex justify-center items-center h-64">
        <div class="text-xl text-gray-500">読み込み中...</div>
      </div>
    {:else if error}
      <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
        <p>{error}</p>
      </div>
    {:else if cards.length === 0}
      <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
        <p>カードが見つかりませんでした。</p>
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
