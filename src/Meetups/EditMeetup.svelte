<script>
  import meetups from "./meetup-store";
  import { createEventDispatcher } from "svelte";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";
  import { isValidEmail, notEmpty } from "../helpers/validation";

  export let id = null;

  let title = "";
  let subtitle = "";
  let address = "";
  let email = "";
  let description = "";
  let imageUrl = "";

  if (id) {
    const unsubscribe = meetups.subscribe((items) => {
      const selectedMeetup = items.find((i) => i.id === id);
      title = selectedMeetup.title;
      subtitle = selectedMeetup.subtitle;
      address = selectedMeetup.address;
      email = selectedMeetup.contactEmail;
      description = selectedMeetup.description;
      imageUrl = selectedMeetup.imageUrl;
    });

    unsubscribe();
  }

  const dispatch = createEventDispatcher();

  $: titleValid = !notEmpty(title);
  $: subtitleValid = !notEmpty(subtitle);
  $: addressValid = !notEmpty(address);
  $: emailValid = isValidEmail(email);
  $: descriptionValid = !notEmpty(description);
  $: imageUrlValid = !notEmpty(imageUrl);
  $: formIsValid =
    titleValid &&
    subtitleValid &&
    descriptionValid &&
    addressValid &&
    emailValid &&
    imageUrlValid;

  function submitForm() {
    const meetupData = {
      title: title,
      subtitle: subtitle,
      description: description,
      imageUrl: imageUrl,
      address: address,
      contactEmail: email,
    };

    if (id) {
      fetch(
        `https://edit-meetup-default-rtdb.firebaseio.com/meetups/${id}.json`,
        {
          method: "PATCH",
          body: JSON.stringify(meetupData),
          headers: { "Content-Type": "application/json" },
        },
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed! An error ocurred please ty again!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      meetups.updateMeetup(id, meetupData);
    } else {
      fetch("https://edit-meetup-default-rtdb.firebaseio.com/meetups.json", {
        method: "POST",
        body: JSON.stringify({ ...meetupData, isFavorite: false }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          meetups.addMeetup({
            ...meetupData,
            isFavorite: false,
            id: data.name,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    dispatch("save");
  }

  function deleteMeetup() {
    fetch(
      `https://edit-meetup-default-rtdb.firebaseio.com/meetups/${id}.json`,
      {
        method: "DELETE",
      },
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed! An error ocurred please ty again!");
        }
      })
      .catch((err) => console.log(err));
    meetups.removeMeetup(id);
    dispatch("save");
  }

  function cancel() {
    dispatch("cancel");
  }
</script>

<Modal title="Edit Meetup Data" on:cancel>
  <form on:submit|preventDefault={submitForm}>
    <TextInput
      id="title"
      label="Title"
      valid={titleValid}
      validityMessage="Please Input"
      value={title}
      on:input={(event) => (title = event.target.value)}
    />

    <TextInput
      id="subtitle"
      label="Subtitle"
      valid={subtitleValid}
      validityMessage="Please Input"
      value={subtitle}
      on:input={(event) => (subtitle = event.target.value)}
    />

    <TextInput
      id="address"
      label="Address"
      valid={addressValid}
      validityMessage="Please Input"
      value={address}
      on:input={(event) => (address = event.target.value)}
    />

    <TextInput
      id="imageUrl"
      label="Image URL"
      valid={imageUrlValid}
      validityMessage="Please Input"
      value={imageUrl}
      on:input={(event) => (imageUrl = event.target.value)}
    />

    <TextInput
      id="email"
      label="E-Mail"
      valid={emailValid}
      validityMessage="Please Input"
      type="email"
      value={email}
      on:input={(event) => (email = event.target.value)}
      class={isValidEmail(email) ? "" : "invalid"}
    />

    <TextInput
      id="description"
      label="Description"
      valid={descriptionValid}
      validityMessage="Please Input"
      controlType="textarea"
      value={description}
      on:input={(event) => (description = event.target.value)}
    />
  </form>
  <div slot="footer">
    <Button type="button" outLine="outline" on:click={cancel}>Cancel</Button>
    <Button type="button" on:click={submitForm} disabled={!formIsValid}
      >Save</Button
    >
    {#if id}
      <Button type="button" on:click={deleteMeetup}>Delete</Button>
    {/if}
  </div>
</Modal>

<style>
  form {
    width: 100%;
  }
</style>
