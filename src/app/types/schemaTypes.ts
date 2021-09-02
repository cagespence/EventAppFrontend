/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddEvent
// ====================================================

export interface AddEvent_createEvent {
  __typename: "Event";
  title: string;
  id: string;
}

export interface AddEvent {
  /**
   * Create an event.
   */
  createEvent: AddEvent_createEvent | null;
}

export interface AddEventVariables {
  title: string;
  description: string;
  date: string;
  host: number;
  startTime: string;
  endTime: string;
  address: string;
  imageUrl: string;
  tags?: number[] | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getEventsByTags
// ====================================================

export interface getEventsByTags_events_event_favorites {
  __typename: "Favorite";
  id: string;
}

export interface getEventsByTags_events_event_attendees_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface getEventsByTags_events_event_attendees {
  __typename: "Attendee";
  user: getEventsByTags_events_event_attendees_user;
}

export interface getEventsByTags_events_event {
  __typename: "Event";
  id: string;
  title: string;
  imageUrl: string;
  startTime: string;
  date: string;
  favorites: (getEventsByTags_events_event_favorites | null)[] | null;
  attendees: (getEventsByTags_events_event_attendees | null)[] | null;
}

export interface getEventsByTags_events {
  __typename: "EventInfo";
  event: getEventsByTags_events_event;
  isLiked: boolean | null;
  isAttending: boolean | null;
  isHost: boolean | null;
}

export interface getEventsByTags {
  /**
   * Get events.
   */
  events: (getEventsByTags_events | null)[] | null;
}

export interface getEventsByTagsVariables {
  tags?: number[] | null;
  page: number;
  amountPerPage: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: registerNewUser
// ====================================================

export interface registerNewUser_createUser {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface registerNewUser {
  /**
   * Create a user.
   */
  createUser: registerNewUser_createUser | null;
}

export interface registerNewUserVariables {
  name: string;
  dob: string;
  email: string;
  password: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: emailAvailability
// ====================================================

export interface emailAvailability {
  /**
   * Checks if email is available to register with.
   */
  isEmailAvailable: boolean | null;
}

export interface emailAvailabilityVariables {
  email: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: attendEvent
// ====================================================

export interface attendEvent_createAttendee {
  __typename: "Attendee";
  id: string;
}

export interface attendEvent {
  /**
   * Create an attendee of an event.
   */
  createAttendee: attendEvent_createAttendee | null;
}

export interface attendEventVariables {
  userId: number;
  eventId: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: unattendEvent
// ====================================================

export interface unattendEvent {
  /**
   * Unattend an event.
   */
  removeAttendee: boolean | null;
}

export interface unattendEventVariables {
  userId: number;
  eventId: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTags
// ====================================================

export interface getTags_tags {
  __typename: "Tag";
  id: string;
  name: string;
}

export interface getTags {
  /**
   * Get all tags in the system.
   */
  tags: (getTags_tags | null)[] | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: signIn
// ====================================================

export interface signIn_signInUser_user_interests_tag {
  __typename: "Tag";
  id: string;
}

export interface signIn_signInUser_user_interests {
  __typename: "Interest";
  id: string;
  tag: signIn_signInUser_user_interests_tag;
}

export interface signIn_signInUser_user {
  __typename: "User";
  id: string;
  email: string;
  interests: (signIn_signInUser_user_interests | null)[] | null;
}

export interface signIn_signInUser {
  __typename: "SigninPayload";
  token: string | null;
  user: signIn_signInUser_user | null;
}

export interface signIn {
  /**
   * Sign user in.
   */
  signInUser: signIn_signInUser | null;
}

export interface signInVariables {
  username: string;
  password: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUser
// ====================================================

export interface getUser_user_interests_tag {
  __typename: "Tag";
  id: string;
  name: string;
}

export interface getUser_user_interests {
  __typename: "Interest";
  id: string;
  tag: getUser_user_interests_tag;
}

export interface getUser_user_attended_event_host {
  __typename: "User";
  id: string;
  email: string;
}

export interface getUser_user_attended_event {
  __typename: "Event";
  id: string;
  title: string;
  date: string;
  host: getUser_user_attended_event_host;
}

export interface getUser_user_attended {
  __typename: "Attendee";
  id: string;
  event: getUser_user_attended_event;
}

export interface getUser_user {
  __typename: "User";
  id: string;
  name: string;
  dob: string;
  bio: string | null;
  email: string;
  interests: (getUser_user_interests | null)[] | null;
  attended: (getUser_user_attended | null)[] | null;
}

export interface getUser {
  /**
   * Look for a user by a given user ID.
   */
  user: getUser_user | null;
}

export interface getUserVariables {
  id?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getFavorites
// ====================================================

export interface getFavorites_user_favorites_event {
  __typename: "Event";
  id: string;
  title: string;
  date: string;
}

export interface getFavorites_user_favorites {
  __typename: "Favorite";
  id: string;
  event: getFavorites_user_favorites_event;
}

export interface getFavorites_user {
  __typename: "User";
  id: string;
  favorites: (getFavorites_user_favorites | null)[] | null;
}

export interface getFavorites {
  /**
   * Look for a user by a given user ID.
   */
  user: getFavorites_user | null;
}

export interface getFavoritesVariables {
  id?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addInterestsToUser
// ====================================================

export interface addInterestsToUser_addInterest {
  __typename: "Interest";
  id: string;
}

export interface addInterestsToUser {
  /**
   * Add an interest (tag) to a user.
   */
  addInterest: (addInterestsToUser_addInterest | null)[] | null;
}

export interface addInterestsToUserVariables {
  userId: number;
  tagsToAdd?: number[] | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createComment
// ====================================================

export interface createComment_createComment_author {
  __typename: "User";
  id: string;
  name: string;
}

export interface createComment_createComment {
  __typename: "Comment";
  id: string;
  createdAt: string;
  author: createComment_createComment_author;
  content: string;
}

export interface createComment {
  /**
   * Create a comment on an event.
   */
  createComment: createComment_createComment | null;
}

export interface createCommentVariables {
  userId: number;
  eventId: number;
  comment: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: favoriteAnEvent
// ====================================================

export interface favoriteAnEvent_addFavorite_user {
  __typename: "User";
  name: string;
}

export interface favoriteAnEvent_addFavorite_event {
  __typename: "Event";
  title: string;
}

export interface favoriteAnEvent_addFavorite {
  __typename: "Favorite";
  id: string;
  user: favoriteAnEvent_addFavorite_user;
  event: favoriteAnEvent_addFavorite_event;
}

export interface favoriteAnEvent {
  /**
   * Add a favorite to an event from a user.
   */
  addFavorite: favoriteAnEvent_addFavorite | null;
}

export interface favoriteAnEventVariables {
  userId: number;
  eventId: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: unfavoriteAnEvent
// ====================================================

export interface unfavoriteAnEvent {
  /**
   * Remove a favorite from an event from a user.
   */
  removeFavorite: boolean | null;
}

export interface unfavoriteAnEventVariables {
  userId: number;
  eventId: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getEventDetails
// ====================================================

export interface getEventDetails_event_event_favorites {
  __typename: "Favorite";
  id: string;
}

export interface getEventDetails_event_event_tags {
  __typename: "Tag";
  id: string;
  name: string;
}

export interface getEventDetails_event_event_host {
  __typename: "User";
  name: string;
  id: string;
}

export interface getEventDetails_event_event_comments_author {
  __typename: "User";
  id: string;
  name: string;
}

export interface getEventDetails_event_event_comments {
  __typename: "Comment";
  content: string;
  author: getEventDetails_event_event_comments_author;
  createdAt: string;
}

export interface getEventDetails_event_event_attendees_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface getEventDetails_event_event_attendees {
  __typename: "Attendee";
  user: getEventDetails_event_event_attendees_user;
}

export interface getEventDetails_event_event {
  __typename: "Event";
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  imageUrl: string;
  favorites: (getEventDetails_event_event_favorites | null)[] | null;
  tags: (getEventDetails_event_event_tags | null)[] | null;
  host: getEventDetails_event_event_host;
  comments: (getEventDetails_event_event_comments | null)[] | null;
  address: string;
  attendees: (getEventDetails_event_event_attendees | null)[] | null;
}

export interface getEventDetails_event {
  __typename: "EventInfo";
  event: getEventDetails_event_event;
  isAttending: boolean | null;
  isLiked: boolean | null;
  isHost: boolean | null;
}

export interface getEventDetails {
  /**
   * Look for an event by a given event ID.
   */
  event: getEventDetails_event | null;
}

export interface getEventDetailsVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateEvent
// ====================================================

export interface updateEvent_updateEvent {
  __typename: "Event";
  id: string;
}

export interface updateEvent {
  /**
   * Edit an existing event.
   * eventId: Int, title: String, description: String, address: String, imageUrl:
   * String, date: String, host: Int, startTime: String, endTime: String, tags: Tags
   */
  updateEvent: updateEvent_updateEvent | null;
}

export interface updateEventVariables {
  eventId: number;
  title: string;
  description: string;
  address: string;
  imageUrl: string;
  date: string;
  startTime: string;
  endTime: string;
  tagIds?: number[] | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: removeEvent
// ====================================================

export interface removeEvent {
  /**
   * Remove an event.
   */
  removeEvent: boolean | null;
}

export interface removeEventVariables {
  userId?: number | null;
  eventId?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
