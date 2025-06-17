<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50">
  <header class="bg-blue-600 text-white shadow-md">
    <div class="container mx-auto px-4 py-4">
      <h1 class="text-2xl font-bold">My Flashcards</h1>
    </div>
  </header>
  
  <main class="container mx-auto px-4 py-8">
    {@render children()}
  </main>
  
  <footer class="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
    <p>© {new Date().getFullYear()} co-place.com</p>
  </footer>
</div>
