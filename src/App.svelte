<script>
    import meetups from "./Meetups/meetup-store";
    import Header from "./UI/Header.svelte";
    import EditMeetup from "./Meetups/EditMeetup.svelte";
    import MeetupDetail from "./Meetups/MeetupDetail.svelte";
    import MeetUpGrid from "./Meetups/MeetUpGrid.svelte";
    import LoadingSpinner from "./Meetups/LoadingSpinner.svelte";
    import Error from "./UI/Error.svelte";

    // let meetups = ;

    let editMode;
    let editedId;
    let page = "overview";
    let pageData = {};
    let isLoading = true;
    let error;

    fetch("https://edit-meetup-default-rtdb.firebaseio.com/meetups.json")
        .then(res => {
            if (!res.ok) {
                throw new Error(
                    "Fetching meetups failed, Paki ulit na lang maya",
                );  
            }
            return res.json();
        })
        .then(data => {
            const loadedMeetups = [];
            for (const key in data) {
                loadedMeetups.push({
                    ...data[key],
                    id: key,
                });
            }
            setTimeout(() => {
                    isLoading = false;
                meetups.setMeetups(loadedMeetups.reverse());
            }, 1000);    
        })
        .catch(err => {
            error = err;
            isLoading = false;
            confirm.log(err);
        });

    function savedMeetup(event) {
        editMode = null;
        editedId = null;
    }

    function cancelEdit() {
        editMode = null;
        editedId = null;
    }

    function showDetails(event) {
        page = "details";
        pageData.id = event.detail;
    }

    function closeDetails() {
        page = "overview";
        pageData = {};
    }

    function startEdit(event) {
        editMode = "edit";
        editedId = event.detail;
    }

    function clearError(){
        error = null;
    }
</script>

{#if error}
<Error message={error.message} on:cancel={clearError} />
{/if}

<Header />

<main>
    {#if page === "overview"}
        {#if editMode === "edit"}
            <EditMeetup
                id={editedId}
                on:save={savedMeetup}
                on:cancel={cancelEdit}
            />
        {/if}
        {#if isLoading}
        <LoadingSpinner />
        {:else}
        <MeetUpGrid
            meetups={$meetups}
            on:showdetails={showDetails}
            on:edit={startEdit}
            on:add={() => {
                editMode = "edit";
            }}
        />
        {/if}
    {:else}
        <MeetupDetail id={pageData.id} on:close={closeDetails} />
    {/if}
</main>

<style>
    main {
        margin-top: 5rem;
    }
</style>
