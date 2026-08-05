<script>
export default {
  name : "EventBasicInformations"

}
</script>

<template>
  <div>
    <BRow class="mb-3">
      <BCol>
        <label for="address1" class="form-label">Address</label>
        <input type="text" class="form-control" id="address1" placeholder="1234 Main St">
      </BCol>
    </BRow>
    <BRow class="mb-3">
      <BCol>
        <label for="address2" class="form-label">Address 2</label>
        <input type="text" class="form-control" id="address2" placeholder="Apartment, studio, or floor">
      </BCol>
    </BRow>
    <BRow class="mb-3">
      <BCol>
        <label for="country" class="form-label">Country</label>
        <select class="form-select" id="country" aria-label="Select Country">
          <option selected>Choose...</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="FR">France</option>
        </select>
      </BCol>
      <BCol>
        <label for="state" class="form-label">State</label>
        <select class="form-select" id="state" aria-label="Select State">
          <option selected>Choose...</option>
          <option value="CA">California</option>
          <option value="NY">New York</option>
          <option value="TX">Texas</option>
        </select>
      </BCol>
      <BCol>
        <label for="zip" class="form-label">ZIP</label>
        <input type="text" class="form-control" id="zip" placeholder="12345">
      </BCol>
    </BRow>
  </div>
</template>

<style scoped>

</style>