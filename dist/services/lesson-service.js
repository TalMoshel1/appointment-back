function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
import { Lesson } from '../models/lesson.js';
import { ObjectId } from 'mongodb'; // Import ObjectId

export function createLesson(_x) {
  return _createLesson.apply(this, arguments);
}
function _createLesson() {
  _createLesson = _asyncToGenerator(function* (lessonData) {
    try {
      let {
        day,
        startTime
      } = lessonData;
      const existingLesson = yield Lesson.findOne({
        day: day,
        startTime: startTime
      });
      const lesson = new Lesson(lessonData);
      const savedLesson = yield lesson.save();
      return savedLesson;
    } catch (error) {
      if (error.message === 'שיעור כבר קבוע בשעה ויום זה') {
        throw error;
      } else {
        throw new Error(error);
      }
    }
  });
  return _createLesson.apply(this, arguments);
}
export function createWeeklyLessons(_x2, _x3) {
  return _createWeeklyLessons.apply(this, arguments);
}
function _createWeeklyLessons() {
  _createWeeklyLessons = _asyncToGenerator(function* (lessonData, repeatEndDate) {
    const createdLessons = [];
    let currentLessonDate = new Date(lessonData.day);
    const repeatedIndex = lessonData.repeatedIndex || new ObjectId();
    if (!(repeatEndDate instanceof Date) || isNaN(repeatEndDate)) {
      throw new Error('Invalid repeatEndDate');
    }
    currentLessonDate.setDate(currentLessonDate.getDate() + 7);
    while (currentLessonDate <= repeatEndDate) {
      const lesson = _objectSpread(_objectSpread({}, lessonData), {}, {
        day: new Date(currentLessonDate),
        repeatedIndex
      });
      const createdLesson = new Lesson(lesson);
      yield createdLesson.save();
      createdLessons.push(createdLesson);
      currentLessonDate.setDate(currentLessonDate.getDate() + 7);
    }
    return createdLessons;
  });
  return _createWeeklyLessons.apply(this, arguments);
}
export function checkRepeatedLesson(_x4, _x5) {
  return _checkRepeatedLesson.apply(this, arguments);
}
function _checkRepeatedLesson() {
  _checkRepeatedLesson = _asyncToGenerator(function* (lessonData, repeatEndDate) {
    const lessonDay = new Date(lessonData.day);
    const lessonDayOfWeek = lessonDay.toLocaleString('en-us', {
      weekday: 'short'
    });
    const startTime = lessonData.startTime;
    const endTime = lessonData.endTime;
    if (repeatEndDate) {
      const existingLesson = yield Lesson.findOne({
        dayOfWeek: lessonDayOfWeek,
        startTime,
        endTime,
        day: {
          $gte: new Date(lessonDay.getFullYear(), lessonDay.getMonth(), lessonDay.getDate()),
          $lte: new Date(repeatEndDate)
        },
        isApproved: true
      });
      return existingLesson;
    }
    const existingLesson = yield Lesson.findOne({
      startTime,
      endTime,
      day: {
        $gte: new Date(lessonDay.getFullYear(), lessonDay.getMonth(), lessonDay.getDate()),
        $lte: new Date(lessonDay.getFullYear(), lessonDay.getMonth(), lessonDay.getDate(), 23, 59, 59) // Assuming end of day
      },

      isApproved: true
    });
    return existingLesson;
  });
  return _checkRepeatedLesson.apply(this, arguments);
}
export function doesApprovePossible(_x6) {
  return _doesApprovePossible.apply(this, arguments);
}
function _doesApprovePossible() {
  _doesApprovePossible = _asyncToGenerator(function* (lessonId) {
    const existingLesson = yield Lesson.findOne({
      _id: lessonId
    });
    if (existingLesson) {
      const {
        startTime,
        endTime,
        day
      } = existingLesson;
      const existingLessonDate = new Date(day);
      const existingYear = existingLessonDate.getFullYear();
      const existingMonth = existingLessonDate.getMonth() + 1;
      const existingDate = existingLessonDate.getDate();
      const duplicateLesson = yield Lesson.findOne({
        startTime,
        endTime,
        isApproved: true,
        $expr: {
          $and: [{
            $eq: [{
              $year: "$day"
            }, existingYear]
          }, {
            $eq: [{
              $month: "$day"
            }, existingMonth]
          }, {
            $eq: [{
              $dayOfMonth: "$day"
            }, existingDate]
          }]
        }
      });
      if (duplicateLesson) {
        return false;
      } else {
        return true;
      }
    }
  });
  return _doesApprovePossible.apply(this, arguments);
}
export function updateLesson(_x7, _x8) {
  return _updateLesson.apply(this, arguments);
}
function _updateLesson() {
  _updateLesson = _asyncToGenerator(function* (id, updatedLessonData) {
    try {
      const updatedLesson = yield Lesson.findByIdAndUpdate(id, updatedLessonData, {
        new: true
      });
      return updatedLesson;
    } catch (error) {
      throw new Error('Could not update lesson');
    }
  });
  return _updateLesson.apply(this, arguments);
}
export function deleteLesson(_x9, _x10) {
  return _deleteLesson.apply(this, arguments);
}
function _deleteLesson() {
  _deleteLesson = _asyncToGenerator(function* (lessonId, deleteAll) {
    try {
      const lesson = yield Lesson.findById(lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }
      if (deleteAll) {
        yield Lesson.deleteMany({
          repeatedIndex: lesson.repeatedIndex
        });
      } else {
        yield Lesson.findByIdAndDelete(lessonId);
      }
    } catch (error) {
      throw new Error('Could not delete lesson');
    }
  });
  return _deleteLesson.apply(this, arguments);
}
export function getLessonsForWeek(_x11) {
  return _getLessonsForWeek.apply(this, arguments);
}
function _getLessonsForWeek() {
  _getLessonsForWeek = _asyncToGenerator(function* (startOfWeek) {
    if (!(startOfWeek instanceof Date)) {
      startOfWeek = new Date(startOfWeek);
    }
    try {
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      const startOfWeekUTC = new Date(Date.UTC(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate()));
      const endOfWeekUTC = new Date(Date.UTC(endOfWeek.getFullYear(), endOfWeek.getMonth(), endOfWeek.getDate()));
      const lessons = yield Lesson.find({
        day: {
          $gte: startOfWeekUTC,
          $lte: endOfWeekUTC
        }
      });
      lessons.sort((a, b) => {
        const dateA = new Date(a.day);
        const dateB = new Date(b.day);
        const timeA = a.startTime.split(':').map(Number);
        const timeB = b.startTime.split(':').map(Number);
        const dateTimeA = new Date(dateA.setHours(timeA[0], timeA[1]));
        const dateTimeB = new Date(dateB.setHours(timeB[0], timeB[1]));
        return dateTimeA - dateTimeB;
      });
      return lessons;
    } catch (error) {
      throw new Error('Could not fetch lessons for the week');
    }
  });
  return _getLessonsForWeek.apply(this, arguments);
}
export function approveLessonById(_x12) {
  return _approveLessonById.apply(this, arguments);
}
function _approveLessonById() {
  _approveLessonById = _asyncToGenerator(function* (lessonId) {
    try {
      const updatedLesson = yield Lesson.findByIdAndUpdate(lessonId, {
        isApproved: true
      }, {
        new: true
      });
      if (!updatedLesson) {
        throw new Error('Lesson not found');
      }
      return updatedLesson;
    } catch (error) {
      console.error('Error approving lesson:', error);
      throw error;
    }
  });
  return _approveLessonById.apply(this, arguments);
}
export function getDayLessons(_x13) {
  return _getDayLessons.apply(this, arguments);
}
function _getDayLessons() {
  _getDayLessons = _asyncToGenerator(function* (date) {
    try {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      // Set start of the day
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      // Set end of the day
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      const lessons = yield Lesson.find({
        day: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });
      return lessons;
    } catch (e) {
      throw new Error('Could not fetch lessons for the day');
    }
  });
  return _getDayLessons.apply(this, arguments);
}
export function getDaysLessons(_x14, _x15) {
  return _getDaysLessons.apply(this, arguments);
}
function _getDaysLessons() {
  _getDaysLessons = _asyncToGenerator(function* (start, end) {
    const startTime = new Date(start);
    startTime.setUTCHours(0, 0, 0, 0);
    const endTime = new Date(end);
    endTime.setUTCHours(23, 59, 59, 999);
    try {
      const lessons = yield Lesson.find({
        day: {
          $gte: startTime,
          $lt: endTime
        }
      });
      return lessons;
    } catch (e) {
      throw new Error('Could not fetch lessons for the days');
    }
  });
  return _getDaysLessons.apply(this, arguments);
}