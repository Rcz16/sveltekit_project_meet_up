<script>
  import {createEventDispatcher} from 'svelte';
  import { scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import MeetupItems from "./MeetupItems.svelte";
  import MeetupFilter from "./MeetupFilter.svelte";
  import Button from "../UI/Button.svelte";

  
  export let meetups;

  const dispatch = createEventDispatcher();

  let favsOnly = false;

  $: filteredMeetups = favsOnly ? meetups.filter(r => r.isFavorite) : meetups;

  function setFilter(event){
    favsOnly = event.detail === 1;
  } 
</script>

<section id ="meetups-controls">
    <MeetupFilter on:select={setFilter} />

    <Button on:click={() => dispatch('add')}>New Meetup</Button>
</section>
{#if filteredMeetups.length === 0 }
<p id="no-meetups">No meetups found, you can start adding some.</p>
{/if}
<section id="meetups">
  {#each filteredMeetups as meetup (meetup.id)}
  <div animate:flip={{duration: 300}} transition:scale>
        <MeetupItems
      id={meetup.id}
      title={meetup.title}
      subtitle={meetup.subtitle}
      description={meetup.description}
      imageUrl={meetup.imageUrl}
      email={meetup.contactEmail}
      address={meetup.address}
      isFav={meetup.isFavorite}
      on:showdetails
      on:edit
    />
  </div>

  {/each}
</section>

<style>
  #meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  #no-meetups{
    margin: 1rem;
  }

  @media (min-width: 768px) {
  #meetups {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  #meetups-controls{
    margin:1rem;
    display: flex;
    justify-content: space-between;

  }
</style>
