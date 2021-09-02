import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { Tag } from "../shared/tags/tags.component";
import gql from "graphql-tag";
import {
  getTags,
  signIn,
  signInVariables,
  emailAvailability,
  emailAvailabilityVariables,
  addInterestsToUser,
  addInterestsToUserVariables,
  getEventDetailsVariables,
  createComment,
  createCommentVariables,
  getUser,
  getUserVariables,
  getEventDetails,
  attendEvent,
  attendEventVariables,
  unattendEvent,
  unattendEventVariables,
  favoriteAnEventVariables,
  favoriteAnEvent,
  unfavoriteAnEvent,
  unfavoriteAnEventVariables,
  updateEvent,
  updateEventVariables,
  removeEventVariables,
  removeEvent,
  getFavorites
} from "../types/schemaTypes";
import { AuthInfo, StorageService } from "./storage.service";
import { EventDetails } from "../event-details/event-details.page";
import {
  prettifyDate,
  prettifyTime,
  prettifyDateAndTime
} from "src/utils/general";
import { Comment } from "../event-details/comment/comment.component";
import { AuthenticationService } from "./authentication.service";
import { Profile, EventItem } from "../profile/profile.page";
import { CompactEvent } from '../feed/feed.page';

export interface CompactUser {
  id: string;
  name: string;
}

export interface UpdateEventDetails {
  eventId: number;
  title: string;
  description: string;
  address: string;
  imageUrl: string;
  date: string;
  startTime: string;
  endTime: string;
  tagIds: Array<number>;
}

@Injectable()
export class ApolloService {
  constructor(
    private apollo: Apollo,
    private storage: StorageService,
    private authentication: AuthenticationService
  ) { }

  attendEvent(eventId: string): Promise<Boolean> {
    const ATTEND_EVENT = gql`
      mutation attendEvent($userId: Int!, $eventId: Int!) {
        createAttendee(userId: $userId, eventId: $eventId) {
          id
        }
      }
    `;

    return new Promise(async (resolve, reject) => {
      const authInfo: AuthInfo = await this.storage.getAuthInfo();

      this.apollo
        .mutate<attendEvent, attendEventVariables>({
          mutation: ATTEND_EVENT,
          variables: {
            userId: parseInt(authInfo.id),
            eventId: parseInt(eventId)
          }
        })
        .subscribe(
          async result => {
            if (result.data.createAttendee.id) {
              resolve(true);
            }
          },
          error => {
            console.log("HANDLE ERROR.");
            console.log("Error getting events - reason:");
            console.log(error);
            return error;
          }
        );
    });
  }

  unattendEvent(eventId: string): Promise<boolean> {
    const UNATTEND_EVENT = gql`
      mutation unattendEvent($userId: Int!, $eventId: Int!) {
        removeAttendee(userId: $userId, eventId: $eventId)
      }
    `;

    return new Promise(async (resolve, reject) => {
      const authInfo: AuthInfo = await this.storage.getAuthInfo();

      this.apollo
        .mutate<unattendEvent, unattendEventVariables>({
          mutation: UNATTEND_EVENT,
          variables: {
            userId: parseInt(authInfo.id),
            eventId: parseInt(eventId)
          },
          update: (cache, { data: { } }) => {
            // cache object here is used as a way to allow devs to have complete local state in order to seamlessly work in offline situations.
          }
        })
        .subscribe(
          async result => {
            if (result.data.removeAttendee) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          error => {
            console.log("HANDLE ERROR.");
            console.log("Error getting events - reason:");
            console.log(error);
            return error;
          }
        );
    });
  }

  getTags(): Promise<Array<Tag>> {
    const GET_TAGS = gql`
      query getTags {
        tags {
          id
          name
        }
      }
    `;

    return new Promise((resolve, reject) => {
      this.apollo
        .watchQuery<getTags, null>({
          query: GET_TAGS,
          fetchPolicy: "network-only" // Important, otherwise Query will not send a network request, instead work off the cached events.
        })
        .valueChanges.subscribe(
          async result => {
            const tags: Array<Tag> = Array();

            if (result.data.tags.length > 0) {
              result.data.tags.forEach(i => {
                const newTag: Tag = {
                  id: i.id,
                  name: i.name,
                  selected: false
                };
                tags.push(newTag);
              });
            }

            resolve(tags);
          },
          error => {
            console.log("HANDLE ERROR.");
            console.log("Error getting events - reason:");
            console.log(error);
            return error;
          }
        );
    });
  }

  signIn(email: string, password: string): Promise<boolean> {
    const SIGN_USER_IN = gql`
      mutation signIn($username: String!, $password: String!) {
        signInUser(auth: { email: $username, password: $password }) {
          token
          user {
            id
            email
            interests {
              id
              tag {
                id
              }
            }
          }
        }
      }
    `;
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate<signIn, signInVariables>({
          mutation: SIGN_USER_IN,
          variables: {
            username: email,
            password: password
          }
        })
        .subscribe(
          async result => {
            if (result.data.signInUser.token) {
              const tags = result.data.signInUser.user.interests.map(t =>
                parseInt(t.tag.id)
              );

              const authInfo: AuthInfo = {
                JWT: result.data.signInUser.token,
                email: result.data.signInUser.user.email,
                id: result.data.signInUser.user.id,
                tags
              };

              await this.storage.storeAuthInfo(authInfo);
              this.authentication.login(authInfo);

              resolve(true);
            }
          },
          error => {
            console.log("Err", error);
            reject(error);
          }
        );
    });
  }

  async getProfile(id: string): Promise<Profile> {
    const GET_USER_BY_ID = gql`
      query getUser($id: ID) {
        user(id: $id) {
          id
          name
          dob
          bio
          email
          interests {
            id
            tag {
              id
              name
            }
          }
          attended {
            id
            event {
              id
              title
              date
              host {
                id
                email
              }
            }
          }
        }
      }
    `;

    return new Promise(async (resolve, reject) => {
      const authInfo: AuthInfo = await this.storage.getAuthInfo();

      this.apollo
        .watchQuery<getUser, getUserVariables>({
          query: GET_USER_BY_ID,
          variables: {
            // This section is where you add in our defined parameters, this auto-completes for you.
            id
          },
          fetchPolicy: "network-only" // Important, otherwise Query will not send a network request, instead work off the cached events.
        })
        .valueChanges.subscribe(
          async result => {
            // Data here is working off the generated types and you'll have auto-completion on events.
            const data = result.data.user;

            const tags: Array<Tag> = Array();

            data.interests.forEach(i => {
              const newTag: Tag = {
                selected: true,
                id: i.tag.id,
                name: i.tag.name
              };
              tags.push(newTag);
            });

            const attending: Array<EventItem> = Array();
            const hosting: Array<EventItem> = Array();

            data.attended.forEach(i => {
              const event: EventItem = {
                id: i.event.id,
                date: prettifyDate(i.event.date).toUpperCase(),
                title: i.event.title,
                host: i.event.host.email
              };
              if (event.host == data.email) {
                hosting.push(event);
              } else {
                attending.push(event);
              }
            });

            const profile: Profile = {
              id: data.id,
              name: data.name,
              bio: data.bio,
              email: data.email,
              dob: data.dob,
              interests: tags,
              attending,
              hosting
            };
            resolve(profile);
          },
          error => {
            console.log("Error getting profile - reason:");
            console.log(error);
          }
        );
    });
  }

  async getFavorites(id: string): Promise<Array<CompactEvent>> {
    const GET_FAVORITES_USERID = gql`
      query getFavorites($id: ID) {
        user(id: $id) {
          id
          favorites {
            id
            event {
              id
              title
              date
            }
          }
        }
      }
    `;

    return new Promise(async (resolve, reject) => {
      const authInfo: AuthInfo = await this.storage.getAuthInfo();

      this.apollo
        .watchQuery<getFavorites, getUserVariables>({
          query: GET_FAVORITES_USERID,
          variables: {
            // This section is where you add in our defined parameters, this auto-completes for you.
            id
          },
          fetchPolicy: "network-only" // Important, otherwise Query will not send a network request, instead work off the cached events.
        })
        .valueChanges.subscribe(
          async result => {
            // Data here is working off the generated types and you'll have auto-completion on events.
            const data = result.data.user;

            const events: Array<CompactEvent> = Array();

            data.favorites.forEach(i => {
              const event: CompactEvent = {
                id: i.event.id,
                date: prettifyDate(i.event.date).toUpperCase(),
                title: i.event.title,
                imageUrl: "",
                startTime: ""
              };

              events.push(event);
            });


            resolve(events);
          },
          error => {
            console.log("Error getting favorites - reason:");
            console.log(error);
          }
        );
    });
  }


  addInterestsToUser(
    tagsToAdd: Array<number>,
    userId: number
  ): Promise<boolean> {
    const ADD_INTERESTS = gql`
      mutation addInterestsToUser($userId: Int!, $tagsToAdd: [Int!]) {
        addInterest(userId: $userId, tags: { tagIds: $tagsToAdd }) {
          id
        }
      }
    `;

    return new Promise((resolve, reject) => {
      this.apollo
        .mutate<addInterestsToUser, addInterestsToUserVariables>({
          mutation: ADD_INTERESTS,
          variables: {
            tagsToAdd,
            userId
          }
        })
        .subscribe(
          async result => {
            // if (result.data.addInterest.length > 0) {
            resolve(true);
            // }
          },
          error => {
            reject(error);
          }
        );
    });
  }

  addCommentToEvent(
    userId: number,
    eventId: number,
    comment: string
  ): Promise<Comment> {
    const ADD_COMMENT_TO_EVENT = gql`
      mutation createComment($userId: Int!, $eventId: Int!, $comment: String!) {
        createComment(userId: $userId, eventId: $eventId, comment: $comment) {
          id
          createdAt
          author {
            id
            name
          }
          content
        }
      }
    `;

    return new Promise((resolve, reject) => {
      this.apollo
        .mutate<createComment, createCommentVariables>({
          mutation: ADD_COMMENT_TO_EVENT,
          variables: {
            comment,
            userId,
            eventId
          }
        })
        .subscribe(
          async result => {
            if (result.data.createComment) {
              const data = result.data.createComment;
              const comment: Comment = {
                content: data.content,
                createdAt: prettifyDateAndTime(data.createdAt),
                user: data.author
              };
              resolve(comment);
            }
          },
          error => {
            reject(error);
          }
        );
    });
  }

  favoriteEvent(eventId: number): Promise<boolean> {
    const FAVORITE_EVENT = gql`
      mutation favoriteAnEvent($userId: Int!, $eventId: Int!) {
        addFavorite(userId: $userId, eventId: $eventId) {
          id
          user {
            name
          }
          event {
            title
          }
        }
      }
    `;

    return new Promise(async (resolve, reject) => {
      const authInfo: AuthInfo = await this.storage.getAuthInfo();

      this.apollo
        .mutate<favoriteAnEvent, favoriteAnEventVariables>({
          mutation: FAVORITE_EVENT,
          variables: {
            eventId,
            userId: parseInt(authInfo.id)
          }
        })
        .subscribe(
          async result => {
            if (result.data.addFavorite.id) {
              resolve(true);
            }
          },
          error => {
            reject(error);
          }
        );
    });
  }

  unfavoriteEvent(eventId: number): Promise<boolean> {
    const UNFAVORITE_EVENT = gql`
      mutation unfavoriteAnEvent($userId: Int!, $eventId: Int!) {
        removeFavorite(userId: $userId, eventId: $eventId)
      }
    `;

    return new Promise(async (resolve, reject) => {
      const authInfo: AuthInfo = await this.storage.getAuthInfo();

      this.apollo
        .mutate<unfavoriteAnEvent, unfavoriteAnEventVariables>({
          mutation: UNFAVORITE_EVENT,
          variables: {
            eventId,
            userId: parseInt(authInfo.id)
          }
        })
        .subscribe(
          async result => {
            if (result.data.removeFavorite) {
              resolve(true);
            }
          },
          error => {
            reject(error);
          }
        );
    });
  }

  getEventDetailsById(
    eventId: string,
    prettifyTimes: boolean = true,
    prettifyDates: boolean = true
  ): Promise<EventDetails> {
    const GET_EVENT_DETAILS_BY_ID = gql`
      query getEventDetails($id: ID!) {
        event(id: $id) {
          event {
            id
            title
            description
            startTime
            endTime
            date
            imageUrl
            favorites {
              id
            }
            tags {
              id
              name
            }
            host {
              name
              id
            }
            comments {
              content
              author {
                id
                name
              }
              createdAt
            }
            address
            attendees {
              user {
                id
                name
              }
            }
          }
          isAttending
          isLiked
          isHost
        }
      }
    `;

    return new Promise((resolve, reject) => {
      this.apollo
        .watchQuery<getEventDetails, getEventDetailsVariables>({
          query: GET_EVENT_DETAILS_BY_ID,
          variables: {
            id: eventId
          },
          fetchPolicy: "network-only" // Important, otherwise Query will not send a network request, instead work off the cached events.
        })
        .valueChanges.subscribe(
          async result => {
            if (!result.errors) {
              const eventInfo = result.data.event;
              const event = eventInfo.event;

              const host: CompactUser = {
                id: event.host.id,
                name: event.host.name
              };

              const tags: Array<Tag> = Array();

              event.tags.forEach(t => {
                const newTag: Tag = {
                  id: t.id,
                  name: t.name,
                  selected: true
                };
                tags.push(newTag);
              });

              const attendees: Array<CompactUser> = Array();

              event.attendees.forEach(a => {
                const newAttendee: CompactUser = {
                  id: a.user.id,
                  name: a.user.name
                };
                attendees.push(newAttendee);
              });

              const comments: Array<Comment> = Array();

              event.comments.forEach(c => {
                const newComment: Comment = {
                  content: c.content,
                  createdAt: prettifyDateAndTime(c.createdAt),
                  user: c.author
                };
                comments.push(newComment);
              });

              const eventDetails: EventDetails = {
                id: event.id,
                description: event.description,
                address: event.address,
                attendees,
                date: prettifyDates ? prettifyDate(event.date) : event.date,
                imageUrl: event.imageUrl,
                startTime: prettifyTimes
                  ? prettifyTime(event.startTime)
                  : event.startTime,
                endTime: prettifyTimes
                  ? prettifyTime(event.endTime)
                  : event.endTime,
                host,
                tags,
                favoriteCount: event.favorites.length,
                title: event.title,
                comments,
                isAttending: eventInfo.isAttending,
                isLiked: eventInfo.isLiked,
                isHost: eventInfo.isHost
              };
              resolve(eventDetails);
            } else {
              reject(result.errors);
            }
          },
          error => {
            reject(error);
          }
        );
    });
  }

  updateEvent({
    eventId,
    title,
    description,
    address,
    imageUrl,
    date,
    startTime,
    endTime,
    tagIds
  }: UpdateEventDetails): Promise<boolean> {
    const UPDATE_EVENT = gql`
      mutation updateEvent(
        $eventId: Int!
        $title: String!
        $description: String!
        $address: String!
        $imageUrl: String!
        $date: String!
        $startTime: String!
        $endTime: String!
        $tagIds: [Int!]
      ) {
        updateEvent(
          eventId: $eventId
          title: $title
          description: $description
          address: $address
          imageUrl: $imageUrl
          date: $date
          startTime: $startTime
          endTime: $endTime
          tags: { tagIds: $tagIds }
        ) {
          id
        }
      }
    `;

    return new Promise((resolve, reject) => {
      this.apollo
        .mutate<updateEvent, updateEventVariables>({
          mutation: UPDATE_EVENT,
          variables: {
            eventId,
            address,
            date,
            description,
            endTime,
            imageUrl,
            startTime,
            tagIds,
            title
          }
        })
        .subscribe(
          async result => {
            if (result.data.updateEvent.id) {
              resolve(true);
            }
          },
          error => {
            reject(error);
          }
        );
    });
  }

  deleteEventById(eventId: string): Promise<boolean> {
    const DELETE_EVENT = gql`
      mutation removeEvent($userId: Int, $eventId: Int) {
        removeEvent(userId: $userId, eventId: $eventId)
      }
    `;

    return new Promise(async (resolve, reject) => {
      const authInfo: AuthInfo = await this.storage.getAuthInfo();

      this.apollo
        .mutate<removeEvent, removeEventVariables>({
          mutation: DELETE_EVENT,
          variables: {
            userId: parseInt(authInfo.id),
            eventId: parseInt(eventId)
          }
        })
        .subscribe(
          async result => {
            if (result.data.removeEvent) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          error => {
            console.log("HANDLE ERROR.");
            console.log("Error getting events - reason:");
            console.log(error);
            return error;
          }
        );
    });
  }
}
