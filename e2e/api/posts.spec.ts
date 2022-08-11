import { expect, test } from '@playwright/test';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../helpers/firebase-client.js';
import { auth as adminAuth } from '../helpers/firebase-admin.js';
import { prisma } from '../helpers/prisma.js'
import { authenticateUser, createUser } from '../helpers/users.js';

let context: any;

const name1 = 'John Doe';
const username1 = 'test1collections';
const email1 = 'test1collectionstest@test.test';
const password1 = 'test123456&/';
let uid1: string;

const name2 = 'John Ratio';
const username2 = 'test2collections';
const email2 = 'test2collectionstest@test.test';
const password2 = 'test123456&/';
let uid2: string;

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
        baseURL: 'http://localhost:4173',
    });
    uid1 = await createUser(context, email1, password1, username1, name1);
    uid2 = await createUser(context, email2, password2, username2, name2);
});