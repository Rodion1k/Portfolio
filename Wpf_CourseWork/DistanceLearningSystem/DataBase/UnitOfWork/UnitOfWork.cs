using System;
using DistanceLearningSystem.DataBase.Repository;
using DistanceLearningSystem.Models;

namespace DistanceLearningSystem.DataBase.UnitOfWork
{
    public class UnitOfWork : IDisposable
    {
        private readonly Context.AppDbContext _context = new Context.AppDbContext(); //TODO в конструкторе ?
        private GenericRepository<UserLogin> _userLoginRepository;
        private GenericRepository<Faculty> _facultyRepository;
        private GenericRepository<UserProfile> _userProfileRepository;
        private GenericRepository<Group> _groupRepository;
        private GenericRepository<Speciality> _specialityRepository;
        private GenericRepository<Subject> _subjectRepository;
        private GenericRepository<SubjectSpecialities> _subjectUserProfilesRepository;
        private GenericRepository<SubjectsUserProfiles> _subjectsUserProfilesRepository;
        private GenericRepository<TestResult> _testsResultsRepository;
        private GenericRepository<Test> _testsRepository;
        private GenericRepository<Question> _questionsRepository;
        private GenericRepository<Answer> _answersRepository;
        private GenericRepository<Lecture> _lectureRepository;

        // TODO добавление репозиториев для каждой таблицы
        public GenericRepository<Answer> AnswersRepository
        {
            get
            {
                if (this._answersRepository == null)
                {
                    this._answersRepository = new GenericRepository<Answer>(_context);
                }
                return _answersRepository;
            }
        }
        public GenericRepository<Question> QuestionsRepository
        {
            get
            {
                if (this._questionsRepository == null)
                {
                    this._questionsRepository = new GenericRepository<Question>(_context);
                }
                return _questionsRepository;
            }
        }
        public GenericRepository<Test> TestsRepository
        {
            get
            {
                if (this._testsRepository == null)
                {
                    this._testsRepository = new GenericRepository<Test>(_context);
                }
                return _testsRepository;
            }
        }
        public GenericRepository<TestResult> TestsResultsRepository
        {
            get
            {
                if (this._testsResultsRepository == null)
                {
                    this._testsResultsRepository = new GenericRepository<TestResult>(_context);
                }
                return _testsResultsRepository;
            }
        }
        public GenericRepository<Lecture> LectureRepository
        {
            get
            {
                if (this._lectureRepository == null)
                {
                    this._lectureRepository = new GenericRepository<Lecture>(_context);
                }

                return _lectureRepository;
            }
        }
            public GenericRepository< SubjectsUserProfiles> SubjectsUserProfilesRepository
            {
                get
                {
                    if (this._subjectsUserProfilesRepository == null)
                    {
                        this._subjectsUserProfilesRepository = new GenericRepository<SubjectsUserProfiles>(_context);
                    }

                    return _subjectsUserProfilesRepository;
                }
            }
            public GenericRepository< SubjectSpecialities> SubjectSpecialities
            {
                get
                {
                    if (this._subjectUserProfilesRepository == null)
                    {
                        this._subjectUserProfilesRepository = new GenericRepository<SubjectSpecialities>(_context);
                    }

                    return _subjectUserProfilesRepository;
                }
            }
            public GenericRepository< Group> GroupRepository
            {
                get
                {
                    if (this._groupRepository == null)
                    {
                        this._groupRepository = new GenericRepository<Group>(_context);
                    }

                    return _groupRepository;
                }
            }
            public GenericRepository< Speciality> SpecialityRepository
            {
                get
                {
                    if (this._specialityRepository == null)
                    {
                        this._specialityRepository = new GenericRepository<Speciality>(_context);
                    }

                    return _specialityRepository;
                }
            }
            public GenericRepository< Subject> SubjectRepository
            {
                get
                {
                    if (this._subjectRepository == null)
                    {
                        this._subjectRepository = new GenericRepository<Subject>(_context);
                    }

                    return _subjectRepository;
                }
            }
            public GenericRepository< UserLogin> UserLoginRepository
            {
                get
                {
                    if (this._userLoginRepository == null)
                    {
                        this._userLoginRepository = new GenericRepository<UserLogin>(_context);
                    }

                    return _userLoginRepository;
                }
            }
            public GenericRepository< Faculty> FacultyRepository
            {
                get
                {
                    if (this._facultyRepository == null)
                    {
                        this._facultyRepository = new GenericRepository<Faculty>(_context);
                    }

                    return _facultyRepository;
                }
            }

            public GenericRepository< UserProfile> UserProfileRepository
            {
                get
                {
                    if (this._userProfileRepository == null)
                    {
                        this._userProfileRepository = new GenericRepository<UserProfile>(_context);
                    }

                    return _userProfileRepository;
                }
            }

            public void Dispose() => _context.Dispose();

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}