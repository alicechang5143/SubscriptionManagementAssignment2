const { expect } = require('chai');
const sinon = require('sinon');
const PlanService = require('../services/PlanService');

describe('PlanService Functional Tests', () => {
  afterEach(() => sinon.restore());

  it('FT-01 creates a monthly plan successfully', async () => {
    const repository = { create: sinon.stub().resolves({ name: 'Basic', price: 10, duration: 'monthly' }) };
    const service = new PlanService(repository);

    const result = await service.createPlan({ name: 'Basic', price: 10, duration: 'monthly' });

    expect(result.name).to.equal('Basic');
    expect(repository.create.calledOnce).to.equal(true);
  });

  it('FT-02 applies yearly pricing strategy successfully', async () => {
    const repository = { create: sinon.stub().callsFake((data) => Promise.resolve(data)) };
    const service = new PlanService(repository);

    const result = await service.createPlan({ name: 'Premium', price: 20, duration: 'yearly' });

    expect(result.calculatedPrice).to.equal(216);
  });

  it('FT-03 rejects invalid plan input', async () => {
    const service = new PlanService({ create: sinon.stub() });

    try {
      await service.createPlan({ price: -1 });
      throw new Error('Expected validation error was not thrown');
    } catch (error) {
      expect(error.statusCode).to.equal(400);
    }
  });

  it('FT-04 updates a plan successfully', async () => {
    const repository = {
      findById: sinon.stub().resolves({ _id: 'p1', price: 10, duration: 'monthly' }),
      updateById: sinon.stub().resolves({ _id: 'p1', name: 'Updated' }),
    };
    const service = new PlanService(repository);

    const result = await service.updatePlan('p1', { name: 'Updated' });

    expect(result.name).to.equal('Updated');
  });

  it('FT-05 deletes a plan successfully', async () => {
    const repository = { deleteById: sinon.stub().resolves({ _id: 'p1' }) };
    const service = new PlanService(repository);

    const result = await service.deletePlan('p1');

    expect(result._id).to.equal('p1');
  });
});
