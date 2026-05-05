const { expect } = require('chai');
const sinon = require('sinon');
const SubscriptionService = require('../services/SubscriptionService');

describe('SubscriptionService Functional Tests', () => {
  afterEach(() => sinon.restore());

  const eventManager = { notify: sinon.stub() };

  it('FT-06 creates a subscription successfully', async () => {
    const subscriptionRepository = {
      create: sinon.stub().resolves({ _id: 's1', status: 'active' }),
      findById: sinon.stub().resolves({ _id: 's1', status: 'active', plan: { name: 'Basic' } }),
    };
    const planRepository = { findById: sinon.stub().resolves({ _id: 'p1', isActive: true }) };
    const service = new SubscriptionService(subscriptionRepository, planRepository, eventManager);

    const result = await service.createSubscription('u1', 'p1');

    expect(result.status).to.equal('active');
    expect(subscriptionRepository.create.calledOnce).to.equal(true);
  });

  it('FT-07 cancels a subscription successfully', async () => {
    const subscriptionRepository = {
      updateUserSubscription: sinon.stub().resolves({ _id: 's1', status: 'cancelled' }),
    };
    const service = new SubscriptionService(subscriptionRepository, {}, eventManager);

    const result = await service.cancelSubscription('u1', 's1');

    expect(result.status).to.equal('cancelled');
  });

  it('FT-08 renews a subscription successfully', async () => {
    const subscriptionRepository = {
      findUserSubscription: sinon.stub().resolves({ _id: 's1', renewalCount: 1 }),
      updateUserSubscription: sinon.stub().resolves({ _id: 's1', status: 'active', renewalCount: 2 }),
    };
    const service = new SubscriptionService(subscriptionRepository, {}, eventManager);

    const result = await service.renewSubscription('u1', 's1');

    expect(result.renewalCount).to.equal(2);
  });

  it('FT-09 deletes a subscription successfully', async () => {
    const subscriptionRepository = {
      deleteUserSubscription: sinon.stub().resolves({ _id: 's1', status: 'cancelled' }),
    };
    const service = new SubscriptionService(subscriptionRepository, {}, eventManager);

    const result = await service.deleteSubscription('u1', 's1');

    expect(result._id).to.equal('s1');
  });
});
