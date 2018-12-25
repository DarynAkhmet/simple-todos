 import { Meteor } from 'meteor/meteor';
 import { Mongo } from 'meteor/mongo';
 import { check } from 'meteor/check';
 
 export const Tasks = new Mongo.Collection('tasks');
 
 if (Meteor.isServer) {
   // This code only runs on the server
   // Only publish tasks that are public or belong to the current user
   Meteor.publish('tasks', function tasksPublication() {
     return Tasks.find({
       $or: [
         { private: { $ne: true } },
         { owner: this.userId },
       ],
     });
   });
 }
 // тут надо убедиться, что пользователь вошел в систему, прежде чем вставлять задачу
 Meteor.methods({
   'tasks.insert'(text) {
     check(text, String);
 
     if (! this.userId) {
       throw new Meteor.Error('not-authorized');
     }
 
     Tasks.insert({
       text,
       createdAt: new Date(),
       owner: this.userId,
       username: Meteor.users.findOne(this.userId).username,
     });
   },
   // здесь задача является приватной и только владелец может удалить ее
  'tasks.remove'(taskId) {
    check(taskId, String);
     const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
     Tasks.remove(taskId);
  },
     //здесь надо удостовериться, что задача проверена
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
     const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      
      throw new Meteor.Error('not-authorized');
    }
     Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  // только владелец задачи может сделать задачу приватной
  'tasks.setPrivate'(taskId, setToPrivate) {
     check(taskId, String);
     check(setToPrivate, Boolean);
 
     const task = Tasks.findOne(taskId);
 
     if (task.owner !== this.userId) {
       throw new Meteor.Error('not-authorized');
     }
 
     Tasks.update(taskId, { $set: { private: setToPrivate } });
   },
 });