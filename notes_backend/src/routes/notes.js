const express = require('express');
const notesController = require('../controllers/notes');
const { requireAuth, validateBody, schemas } = require('../middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Notes
 *     description: Manage notes for the authenticated user
 */

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: List notes for current user
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: A list of notes
 */
router.get('/', requireAuth, notesController.list.bind(notesController));

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created
 */
router.post('/', requireAuth, validateBody(schemas.noteSchema), notesController.create.bind(notesController));

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get a single note by id
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note retrieved
 *       404:
 *         description: Note not found
 */
router.get('/:id', requireAuth, notesController.get.bind(notesController));

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update a note by id
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated
 *       404:
 *         description: Note not found
 */
router.put('/:id', requireAuth, validateBody(schemas.noteSchema), notesController.update.bind(notesController));

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note by id
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted
 *       404:
 *         description: Note not found
 */
router.delete('/:id', requireAuth, notesController.remove.bind(notesController));

module.exports = router;
