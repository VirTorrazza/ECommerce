import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('http://localhost:8080');

describe('Project testing', () => {

    describe('Test route api/products', () => {

        it('Should return all products when GET /api/products/ is called', async () => {
            try {
                const response = await requester.get('/api/products/');
                console.log("Response Body:", response.body);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an('array');
            } catch (error) {
                console.error('Error fetching products:', error);
                throw error;
            }
        });

        it('Should create a product when POST /api/products/ is called', async () => {
            const productMock = {
                title: "EReader",
                description: "Apple E-Reader v.5",
                code: "23452672",
                price: 200,
                stock: 2,
                category: "Electronics",
                owner: "admin"
            };

            try {
                const response = await requester.post('/api/products/').send(productMock);
                const { status, body } = response;
                expect(status).to.equal(200);
                expect(body.payload).to.have.property('_id');
            } catch (error) {
                console.error('Error creating product:', error);
                throw error;
            }
        });
    });

    describe('Test route api/sessions/register', () => {
        it('POST api/sessions/register should register a user', async () => {
            const userMock = {
                first_name: "UserMockedName",
                last_name: "UserMockedLastName",
                email: "UserMockedName@dev.com",
                age: 41,
                password: "mountain",
            };

            try {
                const response = await requester.post('/api/sessions/register').send(userMock);
                const { status } = response;
                expect(status).to.equal(302);
            } catch (error) {
                console.error('Error registering user:', error);
                throw error;
            }
        });
    });

});
