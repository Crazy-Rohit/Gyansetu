// client/src/data/coursesData.js
//
// This file is the ENTIRE content database for the site — there is no
// server/API anymore. To add or change what students see, edit the
// `classes` array below and save the file (Vite will hot-reload it).
//
// Shape reference:
//
// classes: [
//   {
//     id: string            // unique slug, used in the URL, e.g. "class-9"
//     name: string          // display name, e.g. "Class 9"
//     description?: string
//     subjects: [
//       {
//         id: string        // unique within this class, e.g. "maths"
//         name: string
//         description?: string
//         chapters: [
//           {
//             id: string           // unique within this subject, e.g. "ch-1"
//             chapterNumber?: number
//             title: string
//             description?: string
//             content: {
//               lectures: [{ id, title, description?, youtubeUrl, durationMinutes? }]
//               notes:    [{ id, title, description?, fileUrl, pagesCount? }]
//               tests:    [{ id, title, description?, fileUrl?, externalUrl?, maxMarks? }]
//               books:    [{ id, title, description?, externalUrl?, fileUrl?, pagesCount? }]
//             }
//           }
//         ]
//       }
//     ]
//   }
// ]
//
// Every item needs a unique `id` within its list (used as the React key).
// Leave a content array empty ([]) if you have nothing to add yet — the
// page will just show "No <type> available for this chapter yet."
//
// Lecture videos below were imported from "Youtube Videos List.xlsx"
// (the `id` on each lecture is the YouTube video ID). Notes/tests/books
// are still empty — add them the same way once that folder is shared.

export const classes = [
  {
    "id": "class-9",
    "name": "Class 9",
    "description": "NCERT Mathematics for Class 9.",
    "subjects": [
      {
        "id": "maths",
        "name": "Mathematics",
        "description": "Complete NCERT Class 9 Maths syllabus.",
        "chapters": [
          {
            "id": "ch-1",
            "chapterNumber": 1,
            "title": "Number Systems",
            "content": {
              "lectures": [
                {
                  "id": "KqjA9te-Wq4",
                  "title": "Class 9 Mathematics Chapter 1 | Number Systems Introduction | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=KqjA9te-Wq4"
                },
                {
                  "id": "46BP3T3p2XY",
                  "title": "Class 9 Mathematics – Chapter 1 | Number Systems | Exercise 1.1",
                  "youtubeUrl": "https://www.youtube.com/watch?v=46BP3T3p2XY"
                },
                {
                  "id": "zradRceMSO4",
                  "title": "Class 9 Mathematics - Chapter 1 | Number Systems | Pythagoras Theorem | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=zradRceMSO4"
                },
                {
                  "id": "vkxPz2FiCws",
                  "title": "Class 9 Mathematics – Chapter 1 | Number Systems | Exercise 1.2 | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=vkxPz2FiCws"
                },
                {
                  "id": "56Jex6o9MX0",
                  "title": "Class 9 Mathematics – Chapter 1 | Number Systems | Decimal Expansions | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=56Jex6o9MX0"
                },
                {
                  "id": "UlmBjwMesj4",
                  "title": "Class 9 Mathematics – Chapter 1: Number Systems | Exercise 1.3 | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=UlmBjwMesj4"
                },
                {
                  "id": "e0AtHfkRGck",
                  "title": "Class 9 Mathematics –Chapter 1 | Number Systems | Real Number Operations & Exercise 1.4 | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=e0AtHfkRGck"
                },
                {
                  "id": "9GEOkAJw72s",
                  "title": "Class 9 Mathematics – Chapter 1 | Number System | Laws of Exponents | Exercise 1.5 | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=9GEOkAJw72s"
                }
              ],
              "notes": [
                {
                  "id": "class-9-notes-1",
                  "title": "Number Systems – Notes",
                  "fileUrl": "/documents/class-9/notes/chapter-1-notes.pdf"
                }
              ],
              "tests": [],
              "books": [
                {
                  "id": "class-9-book-1",
                  "title": "NCERT Class 9 Maths Textbook – Chapter 1: Number Systems",
                  "fileUrl": "/documents/class-9/books/chapter-1.pdf"
                }
              ]
            }
          },
          {
            "id": "ch-2",
            "chapterNumber": 2,
            "title": "Polynomials",
            "content": {
              "lectures": [
                {
                  "id": "dZSFgPnGe_M",
                  "title": "Class 9 Mathematics – Chapter 2 | Polynomials | Basics, Types, Degree & Validation | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=dZSFgPnGe_M"
                },
                {
                  "id": "7yHRV0sOT4M",
                  "title": "Class 9 Mathematics – Chapter 2 | Polynomials | Exercise 2.1 | Full NCERT Solution | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=7yHRV0sOT4M"
                },
                {
                  "id": "rRv-gYk_YxM",
                  "title": "Class 9 Mathematics – Chapter 2 | Zero of Polynomials | Exercise 2.2 NCERT Solution | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=rRv-gYk_YxM"
                },
                {
                  "id": "rxCJ-9jnE3w",
                  "title": "Class 9 Mathematics – Chapter 2 | Polynomial | Factor Theorem | Polynomial Factorisation | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=rxCJ-9jnE3w"
                },
                {
                  "id": "tbd7TKn3uQ0",
                  "title": "Class 9 Mathematics – Chapter 2 | Polynomial | Exercise 2.3 – Complete NCERT Solution | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=tbd7TKn3uQ0"
                },
                {
                  "id": "qRy9duAzYRc",
                  "title": "Class 9 Mathematics – Chapter 2 | Polynomial | Algebraic Identities with Proof & Example | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=qRy9duAzYRc"
                },
                {
                  "id": "BnWf5KkkGJM",
                  "title": "Class 9 Mathematics – Chapter 2 | Polynomial | NCERT Exercise 2.4 Solutions (Part 1) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=BnWf5KkkGJM"
                },
                {
                  "id": "JWTB7-2cVIo",
                  "title": "Class 9 Mathematics – Chapter 2 | Polynomial | NCERT Exercise 2.4 Solutions (Part 2) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=JWTB7-2cVIo"
                },
                {
                  "id": "uLEax5fMSgM",
                  "title": "Class 9 Mathematics – Chapter 2 | Polynomial | NCERT Exercise 2.4 Solutions (Part 3) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=uLEax5fMSgM"
                },
                {
                  "id": "KIA5avS2EBo",
                  "title": "Class 9 Mathematics – Chapter 2 | Polynomial | NCERT Exercise 2.4 Solutions (Part 4) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=KIA5avS2EBo"
                }
              ],
              "notes": [
                {
                  "id": "class-9-notes-2",
                  "title": "Polynomials – Notes",
                  "fileUrl": "/documents/class-9/notes/chapter-2-notes.pdf"
                }
              ],
              "tests": [],
              "books": [
                {
                  "id": "class-9-book-2",
                  "title": "NCERT Class 9 Maths Textbook – Chapter 2: Polynomials",
                  "fileUrl": "/documents/class-9/books/chapter-2.pdf"
                }
              ]
            }
          },
          {
            "id": "ch-3",
            "chapterNumber": 3,
            "title": "Coordinate Geometry",
            "content": {
              "lectures": [
                {
                  "id": "WmvPuVvN6lY",
                  "title": "Class 9 Mathematics – Chapter 3 | Coordinate Geometry| Basic Concepts | Quadrants | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=WmvPuVvN6lY"
                },
                {
                  "id": "EMbEWG0JONM",
                  "title": "Class 9 Mathematics – Chapter 3 | Coordinate Geometry| Ex: 3.1 & Ex: 3.2 NCERT Solutions | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=EMbEWG0JONM"
                }
              ],
              "notes": [
                {
                  "id": "class-9-notes-3",
                  "title": "Coordinate Geometry – Notes",
                  "fileUrl": "/documents/class-9/notes/chapter-3-notes.pdf"
                }
              ],
              "tests": [],
              "books": [
                {
                  "id": "class-9-book-3",
                  "title": "NCERT Class 9 Maths Textbook – Chapter 3: Coordinate Geometry",
                  "fileUrl": "/documents/class-9/books/chapter-3.pdf"
                }
              ]
            }
          },
          {
            "id": "ch-4",
            "chapterNumber": 4,
            "title": "Linear Equations in Two Variables",
            "content": {
              "lectures": [
                {
                  "id": "vy8VSPlXFOw",
                  "title": "Class 9 Mathematics – Chapter 4 | Linear Equations in Two Variables | Basic Concepts | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=vy8VSPlXFOw"
                },
                {
                  "id": "P5vflLaBvZY",
                  "title": "Class 9 Mathematics – Chapter 4 | Standard Form | Exercise 4.1 NCERT Solutions | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=P5vflLaBvZY"
                },
                {
                  "id": "GJt107Pn1t4",
                  "title": "Class 9 Mathematics – Chapter 4 | Solution of Linear Equations | Ex 4.2 NCERT Solutions | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=GJt107Pn1t4"
                }
              ],
              "notes": [
                {
                  "id": "class-9-notes-4",
                  "title": "Linear Equations in Two Variables – Notes",
                  "fileUrl": "/documents/class-9/notes/chapter-4-notes.pdf"
                }
              ],
              "tests": [],
              "books": [
                {
                  "id": "class-9-book-4",
                  "title": "NCERT Class 9 Maths Textbook – Chapter 4: Linear Equations in Two Variables",
                  "fileUrl": "/documents/class-9/books/chapter-4.pdf"
                }
              ]
            }
          },
          {
            "id": "ch-5",
            "chapterNumber": 5,
            "title": "Introduction to Euclid’s Geometry",
            "content": {
              "lectures": [
                {
                  "id": "Hi7TykTTiUc",
                  "title": "Class 9th Mathematics – Chapter 5: Introduction to Euclid's Geometry | Zero-to-Hero Batch | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=Hi7TykTTiUc"
                },
                {
                  "id": "TvyYSpiJMHo",
                  "title": "Class 9 Mathematics – Chapter 5 | Euclid’s 5 Postulates Explanation | Theorem 5.1 | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=TvyYSpiJMHo"
                },
                {
                  "id": "BGkbnzpSiP4",
                  "title": "Class 9 Mathematics – Ch 5 | Introduction to Euclid’s Geometry | Ex 5.1(Part 1) Solutions | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=BGkbnzpSiP4"
                },
                {
                  "id": "BU3_MhMPTC4",
                  "title": "Class 9 Mathematics – Ch 5 | Introduction to Euclid’s Geometry | Ex 5.1(Part 2) Solutions | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=BU3_MhMPTC4"
                }
              ],
              "notes": [],
              "tests": [],
              "books": [
                {
                  "id": "class-9-book-5",
                  "title": "NCERT Class 9 Maths Textbook – Chapter 5: Introduction to Euclid’s Geometry",
                  "fileUrl": "/documents/class-9/books/chapter-5.pdf"
                }
              ]
            }
          },
          {
            "id": "ch-6",
            "chapterNumber": 6,
            "title": "Lines and Angles",
            "content": {
              "lectures": [
                {
                  "id": "QY6QHc5COn8",
                  "title": "Class 9 Mathematics: Chapter 6 | Lines & Angles | Basic Concept | Points, Lines & Angles | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=QY6QHc5COn8"
                },
                {
                  "id": "GgdsOtJtnlQ",
                  "title": "Class 9 Mathematics: Chapter 6 | Lines & Angle | Linear Pair | Key Axiom | Ex 6.1(Part 1) | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=GgdsOtJtnlQ"
                },
                {
                  "id": "7TgHYoyNHpc",
                  "title": "Class 9 Mathematics : Chapter 6 | Lines and Angles | Ex 6.1 (Part 2) NCERT Solutions | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=7TgHYoyNHpc"
                },
                {
                  "id": "QFROiXDAbpM",
                  "title": "Class 9 Mathematics : Chapter 6 | Parallel Lines & Angle | Exercise 6.2 NCERT Solutions | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=QFROiXDAbpM"
                }
              ],
              "notes": [],
              "tests": [],
              "books": [
                {
                  "id": "class-9-book-6",
                  "title": "NCERT Class 9 Maths Textbook – Chapter 6: Lines and Angles",
                  "fileUrl": "/documents/class-9/books/chapter-6.pdf"
                }
              ]
            }
          },
          {
            "id": "ch-7",
            "chapterNumber": 7,
            "title": "Triangles",
            "content": {
              "lectures": [
                {
                  "id": "nns0-yhmTGM",
                  "title": "Class 9 Mathematics – Chapter 7 | Triangles | Basics of Triangles & Congruence Rules | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=nns0-yhmTGM"
                },
                {
                  "id": "yKZF_dH1zCg",
                  "title": "Class 9 Mathematics – Chapter 7 | Triangles | Exercise 7.1 (Part 1) | Important Concepts | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=yKZF_dH1zCg"
                },
                {
                  "id": "g4Qk-Zio8OI",
                  "title": "Class 9 Mathematics – Chapter 7 | Triangles | Exercise 7.1 (Part 2) | Important Concepts | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=g4Qk-Zio8OI"
                },
                {
                  "id": "UbQhxB8N3Yg",
                  "title": "Class 9 Mathematics – Chapter 7 | Triangles | Exercise 7.1 (Part 3) | Important Concepts | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=UbQhxB8N3Yg"
                },
                {
                  "id": "G1KmMtU1I3g",
                  "title": "Class 9 Mathematics – Chapter 7 | Triangles | Properties of Triangle | Theorem 7.2 & 7.3 | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=G1KmMtU1I3g"
                },
                {
                  "id": "Y_2dkH8ou_8",
                  "title": "Class 9 Mathematics – Chapter 7 | Triangles | Exercise 7.2 (Part 1) NCERT Solutions | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=Y_2dkH8ou_8"
                },
                {
                  "id": "GP_A9IolZGk",
                  "title": "Class 9 Mathematics – Chapter 7 | Triangles | Exercise 7.2 (Part 2) NCERT Solutions | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=GP_A9IolZGk"
                },
                {
                  "id": "yWU6CcD_X7I",
                  "title": "Class 9 Mathematics – Chapter 7 | Triangles | SSS & RHS Congruence Rule | Solved Example | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=yWU6CcD_X7I"
                },
                {
                  "id": "HPUJtPHjoLA",
                  "title": "Class 9 Mathematics – Chapter 7 | Triangles | Exercise 7.3 (Part 1) NCERT Solutions | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=HPUJtPHjoLA"
                },
                {
                  "id": "AL4h-K-0t_w",
                  "title": "Class 9 Mathematics – Chapter 7 | Triangles | Exercise 7.3 (Part 2) NCERT Solutions | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=AL4h-K-0t_w"
                }
              ],
              "notes": [],
              "tests": [],
              "books": [
                {
                  "id": "class-9-book-7",
                  "title": "NCERT Class 9 Maths Textbook – Chapter 7: Triangles",
                  "fileUrl": "/documents/class-9/books/chapter-7.pdf"
                }
              ]
            }
          },
          {
            "id": "ch-8",
            "chapterNumber": 8,
            "title": "Quadrilaterals",
            "content": {
              "lectures": [
                {
                  "id": "gfpjNZkINGQ",
                  "title": "Class 9 Mathematics – Chapter 8 | Quadrilaterals Basics | Parallelogram & Its Properties | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=gfpjNZkINGQ"
                },
                {
                  "id": "I2y8EnL23nc",
                  "title": "Class 9 Mathematics – Chapter 8 | Properties of Parallelogram | Theorems 8.1–8.7 | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=I2y8EnL23nc"
                }
              ],
              "notes": [],
              "tests": [],
              "books": [
                {
                  "id": "class-9-book-8",
                  "title": "NCERT Class 9 Maths Textbook – Chapter 8: Quadrilaterals",
                  "fileUrl": "/documents/class-9/books/chapter-8.pdf"
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "id": "class-10",
    "name": "Class 10",
    "description": "NCERT Mathematics for Class 10.",
    "subjects": [
      {
        "id": "maths",
        "name": "Mathematics",
        "description": "Complete NCERT Class 10 Maths syllabus.",
        "chapters": [
          {
            "id": "ch-1",
            "chapterNumber": 1,
            "title": "Real Numbers",
            "content": {
              "lectures": [
                {
                  "id": "yRhaR0jLXQI",
                  "title": "Class 10 Mathematics: Chapter 1 | Real Numbers | Basic Concepts | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=yRhaR0jLXQI"
                },
                {
                  "id": "4vC7n5Pv1y4",
                  "title": "Class 10 Mathematics: Chapter 1 | Real Numbers | LCM & HCF Relation | Exercise 1.1 | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=4vC7n5Pv1y4"
                },
                {
                  "id": "GhfRmu_VjhE",
                  "title": "Class 10 Mathematics: Chapter 1 | Real Numbers | Rational & Irrational Number | Ex -1.2 | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=GhfRmu_VjhE"
                }
              ],
              "notes": [
                {
                  "id": "class-10-notes-1",
                  "title": "Real Numbers – Notes",
                  "fileUrl": "/documents/class-10/notes/chapter-1-notes.pdf"
                }
              ],
              "tests": [],
              "books": [
                {
                  "id": "class-10-book-1",
                  "title": "NCERT Class 10 Maths Textbook – Chapter 1: Real Numbers",
                  "fileUrl": "/documents/class-10/books/chapter-1.pdf"
                }
              ]
            }
          },
          {
            "id": "ch-2",
            "chapterNumber": 2,
            "title": "Polynomials",
            "content": {
              "lectures": [
                {
                  "id": "t4HWlvZR3OU",
                  "title": "Class 10 Mathematics: Chapter 2 | Polynomials | Polynomials – Basics, Types, Degree | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=t4HWlvZR3OU"
                },
                {
                  "id": "7MRmUnT0rDU",
                  "title": "Class 10 Mathematics: Chapter 2 | Polynomials | Graphical Representation | Exercise 2.1 | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=7MRmUnT0rDU"
                },
                {
                  "id": "xnF1NEBLwsM",
                  "title": "Class 10 Mathematics: Chapter 2 | Polynomials | Relation b/w Zeroes and Coefficients | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=xnF1NEBLwsM"
                },
                {
                  "id": "NFGLDPuLCXQ",
                  "title": "Class 10 Mathematics: Chapter 2 | Polynomials | Zeroes & Coefficients | Solved Examples | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=NFGLDPuLCXQ"
                },
                {
                  "id": "tn-idx_CbgQ",
                  "title": "Class 10 Mathematics: Chapter 2 | Polynomials | Exercise 2.2 NCERT Complete Solution | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=tn-idx_CbgQ"
                }
              ],
              "notes": [
                {
                  "id": "class-10-notes-2",
                  "title": "Polynomials – Notes",
                  "fileUrl": "/documents/class-10/notes/chapter-2-notes.pdf"
                }
              ],
              "tests": [],
              "books": [
                {
                  "id": "class-10-book-2",
                  "title": "NCERT Class 10 Maths Textbook – Chapter 2: Polynomials",
                  "fileUrl": "/documents/class-10/books/chapter-2.pdf"
                }
              ]
            }
          },
          {
            "id": "ch-3",
            "chapterNumber": 3,
            "title": "Pair of Linear Equations in Two Variables",
            "content": {
              "lectures": [
                {
                  "id": "6hsZh3KTkBU",
                  "title": "Class 10 Mathematics: Chapter 3 | Linear Equations Basics | Number of Solutions | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=6hsZh3KTkBU"
                },
                {
                  "id": "ZyvF6HepTfQ",
                  "title": "Class 10 Mathematics: Chapter 3 | No. of solution | Graphical Method & Coefficient Method | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=ZyvF6HepTfQ"
                },
                {
                  "id": "I1dQOTAkmpg",
                  "title": "Class 10 Mathematics: Chapter 3 | Exercise 3.1 NCERT Complete Solutions (Part -1) | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=I1dQOTAkmpg"
                },
                {
                  "id": "Untq9eh_SG0",
                  "title": "Class 10 Mathematics: Chapter 3 | Exercise 3.1 NCERT Complete Solutions (Part -2) | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=Untq9eh_SG0"
                },
                {
                  "id": "r5fEwzsCkhI",
                  "title": "Class 10 Mathematics: Chapter 3 | Substitution Method | Ex: 3.2 NCERT Solutions (Part -1) | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=r5fEwzsCkhI"
                },
                {
                  "id": "i4CrO3x3WKY",
                  "title": "Class 10 Mathematics: Chapter 3 | Substitution Method | Ex: 3.2 NCERT Solutions (Part -2) | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=i4CrO3x3WKY"
                },
                {
                  "id": "tFbbk6CSv98",
                  "title": "Class 10 Mathematics: Chapter 3 | Elimination Method | Ex: 3.3 NCERT Solutions (Part - 1) | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=tFbbk6CSv98"
                },
                {
                  "id": "gMaK_guoox8",
                  "title": "Class 10 Mathematics: Chapter 3 | Elimination Method | Ex: 3.3 NCERT Solutions (Part - 2) | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=gMaK_guoox8"
                }
              ],
              "notes": [
                {
                  "id": "class-10-notes-3",
                  "title": "Pair of Linear Equations in Two Variables – Notes",
                  "fileUrl": "/documents/class-10/notes/chapter-3-notes.pdf"
                }
              ],
              "tests": [],
              "books": [
                {
                  "id": "class-10-book-3",
                  "title": "NCERT Class 10 Maths Textbook – Chapter 3: Pair of Linear Equations in Two Variables",
                  "fileUrl": "/documents/class-10/books/chapter-3.pdf"
                }
              ]
            }
          },
          {
            "id": "ch-4",
            "chapterNumber": 4,
            "title": "Quadratic Equations",
            "content": {
              "lectures": [
                {
                  "id": "1qRqztpP_GM",
                  "title": "Class 10 Mathematics: Chapter 4 | Discriminant Method | Exercise 4.3 NCERT Solutions | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=1qRqztpP_GM"
                },
                {
                  "id": "AhesY8FwmgM",
                  "title": "Class 10 Mathematics: Chapter 4 | Exercise 4.2 NCERT Solutions | Factorization Method | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=AhesY8FwmgM"
                },
                {
                  "id": "TiGOVqF3qms",
                  "title": "Class 10 Mathematics: Chapter 4 | Quadratic Equation | Factorization & Discriminant Method |GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=TiGOVqF3qms"
                },
                {
                  "id": "Al0MUyVNFVs",
                  "title": "Class 10 Mathematics: Chapter 4 | Quadratic Equations | Exercise 4.1 Complete Solutions | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=Al0MUyVNFVs"
                },
                {
                  "id": "Eodt4NiweQc",
                  "title": "Class 10 Mathematics: Chapter 4 | Quadratic Equations | Basics | Polynomial v/s Equation | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=Eodt4NiweQc"
                }
              ],
              "notes": [
                {
                  "id": "class-10-notes-4",
                  "title": "Quadratic Equations – Notes",
                  "fileUrl": "/documents/class-10/notes/chapter-4-notes.pdf"
                }
              ],
              "tests": [],
              "books": [
                {
                  "id": "class-10-book-4",
                  "title": "NCERT Class 10 Maths Textbook – Chapter 4: Quadratic Equations",
                  "fileUrl": "/documents/class-10/books/chapter-4.pdf"
                }
              ]
            }
          },
          {
            "id": "ch-5",
            "chapterNumber": 5,
            "title": "Arithmetic Progression (A.P.)",
            "content": {
              "lectures": [
                {
                  "id": "rVUsSjUzpUA",
                  "title": "Class 10 Mathematics – Chapter 5 | Arithmetic Progression | Basic, General Term, Example | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=rVUsSjUzpUA"
                },
                {
                  "id": "eXOfLEGtV5c",
                  "title": "Class 10 Mathematics – Chapter 5 | Arithmetic Progression | Identify AP | Ex 5.1(Part 1) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=eXOfLEGtV5c"
                },
                {
                  "id": "4tdwgEUOXLQ",
                  "title": "Class 10 Mathematics – Chapter 5 | Arithmetic Progressions (AP) | Ex 5.1 (Part 2) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=4tdwgEUOXLQ"
                },
                {
                  "id": "WE8kDIcTCQk",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | General Term (nth Term), Last Term & Types of AP | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=WE8kDIcTCQk"
                },
                {
                  "id": "H2TMzcMlGbg",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Nth Term & Examples | Ex 5.2 (Part 1) Solutions | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=H2TMzcMlGbg"
                },
                {
                  "id": "SxA5bizJT5Y",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Exercise 5.2 (Part 2) NCERT Solutions| Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=SxA5bizJT5Y"
                },
                {
                  "id": "oJZ8X6qAGqg",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Exercise 5.2 (Part 3) NCERT Solutions| Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=oJZ8X6qAGqg"
                },
                {
                  "id": "jM-R03ETg4A",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Exercise 5.2 (Part 4) Advanced Question Solutions| Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=jM-R03ETg4A"
                },
                {
                  "id": "qnuILToEuf0",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Sum of n Terms (Sₙ) | Case Study & Examples | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=qnuILToEuf0"
                },
                {
                  "id": "kZkdk5PCmLg",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Sₙ Important Formulas | Relation b/w Sₙ and aₙ | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=kZkdk5PCmLg"
                },
                {
                  "id": "Vth255v8MXc",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Exercise 5.3 NCERT Solutions (Part-1) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=Vth255v8MXc"
                },
                {
                  "id": "PWxJWcwdimI",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Exercise 5.3 NCERT Solutions (Part-2) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=PWxJWcwdimI"
                },
                {
                  "id": "e_jtI8EfTYQ",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Exercise 5.3 NCERT Solutions (Part-3) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=e_jtI8EfTYQ"
                },
                {
                  "id": "PCkN9yCZz-M",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Exercise 5.3 NCERT Solutions (Part-4) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=PCkN9yCZz-M"
                },
                {
                  "id": "8wQFPF2LggE",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Exercise 5.3 NCERT Solutions (Part-5) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=8wQFPF2LggE"
                },
                {
                  "id": "nHEGSIBdaWI",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Exercise 5.3 NCERT Solutions (Part-6) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=nHEGSIBdaWI"
                },
                {
                  "id": "4LyMN1mIWeM",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Exercise 5.3 NCERT Solutions (Part-7) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=4LyMN1mIWeM"
                },
                {
                  "id": "6RanMYdLDdM",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Exercise 5.4 NCERT Solutions (Part-1) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=6RanMYdLDdM"
                },
                {
                  "id": "l-7XEliPXJg",
                  "title": "Class 10 Mathematics – Chapter 5 | AP | Exercise 5.4 NCERT Solutions (Final Part) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=l-7XEliPXJg"
                }
              ],
              "notes": [],
              "tests": [],
              "books": [
                {
                  "id": "class-10-book-5",
                  "title": "NCERT Class 10 Maths Textbook – Chapter 5: Arithmetic Progression (A.P.)",
                  "fileUrl": "/documents/class-10/books/chapter-5.pdf"
                }
              ]
            }
          },
          {
            "id": "ch-6",
            "chapterNumber": 6,
            "title": "Triangles",
            "content": {
              "lectures": [
                {
                  "id": "llwLj9t3op0",
                  "title": "Class 10 Mathematics – Chapter 6 | Triangles | Basics of Similarity & Congruency Revision | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=llwLj9t3op0"
                },
                {
                  "id": "JijWwjU25qM",
                  "title": "Class 10 Mathematics – Chapter  6 | Triangles | Exercise 6.1 NCERT Solutions | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=JijWwjU25qM"
                },
                {
                  "id": "Dy2qvPwu0ws",
                  "title": "Class 10 Mathematics – Ch 6 | Triangles | Similarity of Triangles & Important Theorems | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=Dy2qvPwu0ws"
                },
                {
                  "id": "N0V5Qi7YDRU",
                  "title": "Class 10 Mathematics – Chapter 6 | Triangles | Exercise 6.2 NCERT Solutions (Part-1) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=N0V5Qi7YDRU"
                },
                {
                  "id": "_uyt7mwQQJM",
                  "title": "Class 10 Mathematics – Chapter 6 | Triangles | Exercise 6.2 NCERT Solutions (Part-2) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=_uyt7mwQQJM"
                },
                {
                  "id": "PDCtpnWWXYI",
                  "title": "Class 10 Mathematics – Chapter 6 | Triangles | Exercise 6.2 NCERT Solutions (Part-3) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=PDCtpnWWXYI"
                },
                {
                  "id": "ufowISPhmzs",
                  "title": "Class 10 Mathematics – Chapter 6 | Triangles | Exercise 6.2 NCERT Solutions (Part-4) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=ufowISPhmzs"
                },
                {
                  "id": "ulKl3g-7qcQ",
                  "title": "Class 10 Mathematics – Chapter 6 | Criteria for Similarity of Triangles (AAA, SSS, SAS) | GyanSetu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=ulKl3g-7qcQ"
                },
                {
                  "id": "cSfyJbmAVx4",
                  "title": "Class 10 Mathematics – Chapter 6 | Triangles | Exercise 6.3 NCERT Solutions (Part-1) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=cSfyJbmAVx4"
                },
                {
                  "id": "qcfx-LOx17c",
                  "title": "Class 10 Mathematics – Chapter 6 | Triangles | Exercise 6.3 NCERT Solutions (Part-2) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=qcfx-LOx17c"
                },
                {
                  "id": "5D_CQHZ3VLo",
                  "title": "Class 10 Mathematics – Chapter 6 | Triangles | Exercise 6.3 NCERT Solutions (Part-3) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=5D_CQHZ3VLo"
                },
                {
                  "id": "QtAStKm6JVg",
                  "title": "Class 10 Mathematics – Chapter 6 | Triangles | Exercise 6.3 NCERT Solutions (Part-4) | Gyan Setu",
                  "youtubeUrl": "https://www.youtube.com/watch?v=QtAStKm6JVg"
                }
              ],
              "notes": [],
              "tests": [],
              "books": [
                {
                  "id": "class-10-book-6",
                  "title": "NCERT Class 10 Maths Textbook – Chapter 6: Triangles",
                  "fileUrl": "/documents/class-10/books/chapter-6.pdf"
                }
              ]
            }
          }
        ]
      }
    ]
  }
];

export function getClasses() {
  return classes;
}

export function getClassById(classId) {
  return classes.find((c) => c.id === classId) || null;
}

export function getSubjectsByClass(classId) {
  return getClassById(classId)?.subjects || [];
}

export function getSubjectById(classId, subjectId) {
  return getSubjectsByClass(classId).find((s) => s.id === subjectId) || null;
}

export function getChaptersBySubject(classId, subjectId) {
  return getSubjectById(classId, subjectId)?.chapters || [];
}

export function getChapterById(classId, subjectId, chapterId) {
  return (
    getChaptersBySubject(classId, subjectId).find((c) => c.id === chapterId) ||
    null
  );
}

export function getContentByChapter(classId, subjectId, chapterId) {
  const chapter = getChapterById(classId, subjectId, chapterId);
  return (
    chapter?.content || { lectures: [], notes: [], tests: [], books: [] }
  );
}

/**
 * Searches across every class/subject/chapter for a text match.
 * Returns flat, link-ready results.
 */
export function searchChapters(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results = [];
  for (const cls of classes) {
    for (const subject of cls.subjects) {
      for (const chapter of subject.chapters) {
        const haystack = `${cls.name} ${subject.name} ${chapter.title}`.toLowerCase();
        if (haystack.includes(q)) {
          results.push({
            classId: cls.id,
            className: cls.name,
            subjectId: subject.id,
            subjectName: subject.name,
            chapterId: chapter.id,
            chapterTitle: chapter.title,
          });
        }
      }
    }
  }
  return results;
}
