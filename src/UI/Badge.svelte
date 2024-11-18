<script>
    import { slide } from "svelte/transition";
</script>

<span transition:slide>
    <slot />
</span>

<style>
    span {
        display: inline-block;
        margin: 0 0.25rem;
        border-radius: 3px;
        border: 1px solid skyblue;
        background: skyblue;
        color: white;
        padding: 0 0.5rem;
        font-family: "Times New Roman", serif;
        font-size: 0.8rem;
    }
</style>
