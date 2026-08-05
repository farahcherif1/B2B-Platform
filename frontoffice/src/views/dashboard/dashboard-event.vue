<script>
import { CountTo } from "vue3-count-to";

import {
  UsersIcon,
  ActivityIcon,
  ClockIcon,
} from "@zhuowenli/vue-feather-icons";
import {
  basicLineChart,
  zoomableChart,
  lineDatalabelChart,
  lineAnnotation,
  syncingAreaChart,
  brushLineChart,
  brushAreaChart,
  steplineChart,
  gradientLineChart,
  realtimeLineChart,
  dashedLineChart,
  missingDataChart,
} from "./data";

export default {
  data() {
    return {
      basicLineChart: basicLineChart,
      zoomableChart: zoomableChart,
      lineDatalabelChart: lineDatalabelChart,
      lineAnnotation: lineAnnotation,
      syncingAreaChart: syncingAreaChart,
      brushLineChart: brushLineChart,
      brushAreaChart: brushAreaChart,
      steplineChart: steplineChart,
      gradientLineChart: gradientLineChart,
      realtimeLineChart: realtimeLineChart,
      dashedLineChart: dashedLineChart,
      missingDataChart: missingDataChart,
    };
  },
  components: {
    CountTo,
    UsersIcon,
    ActivityIcon,
    ClockIcon,
  },
};
</script>

<template>
  <BRow>
    <BCol md="6">
      <BCard no-body class="card-animate">
        <BCardBody>
          <div class="d-flex justify-content-between">
            <div>
              <p class="fw-medium text-muted mb-0 fw-semibold h4">
                Participants
              </p>
              <h2 class="mt-4 ff-secondary fw-semibold">
                <count-to
                  :startVal="0"
                  :endVal="28.05"
                  :duration="5000"
                ></count-to
                >k
              </h2>
              <p class="mb-0 text-muted h5">
                <BBadge class="bg-light text-success mb-0">
                  <i class="ri-arrow-up-line align-middle"></i> 16.24 %
                </BBadge>
                par rapport au evenement precedent.
              </p>
            </div>
            <div>
              <div class="avatar-sm flex-shrink-0">
                <span
                  class="avatar-title rounded-circle fs-2"
                  style="background-color: #ffe1ea"
                >
                  <users-icon class="text-primary icon-md"></users-icon>
                </span>
              </div>
            </div>
          </div>
        </BCardBody>
      </BCard>
    </BCol>

    <BCol md="6">
      <BCard no-body class="card-animate">
        <BCardBody>
          <div class="d-flex justify-content-between">
            <div>
              <p class="fw-medium text-muted mb-0 fw-semibold h4">Meeting</p>
              <h2 class="mt-4 ff-secondary fw-semibold">
                <count-to
                  :startVal="0"
                  :endVal="3.05"
                  :duration="5000"
                ></count-to
                >k
              </h2>
              <p class="mb-0 text-muted h5">
                <BBadge class="bg-light text-success mb-0">
                  <i class="ri-arrow-up-line align-middle"></i> 16.24 %
                </BBadge>
                par rapport au evenement precedent.
              </p>
            </div>

            <div>
              <div class="avatar-sm flex-shrink-0">
                <span
                  class="avatar-title rounded-circle fs-2"
                  style="background-color: #ffe1ea"
                >
                  <ClockIcon class="text-primary icon-md"></ClockIcon>
                </span>
              </div>
            </div>
          </div>
        </BCardBody>
      </BCard>
    </BCol>
  </BRow>
  <BRow>
    <BCol md="6">
      <BCard no-body class="card-animate">
        <BCardBody>
          <div class="d-flex justify-content-between">
            <div>
              <p class="fw-medium text-muted mb-0 fw-semibold h4">Sessions</p>
              <h2 class="mt-4 ff-secondary fw-semibold">
                <count-to
                  :startVal="0"
                  :endVal="28.05"
                  :duration="5000"
                ></count-to
                >k
              </h2>
              <p class="mb-0 text-muted h5">
                <BBadge class="bg-light text-danger mb-0">
                  <i class="ri-arrow-down-line align-middle"></i> 16.24 %
                </BBadge>
                par rapport au evenement precedent.
              </p>
            </div>
            <div>
              <div class="avatar-sm flex-shrink-0">
                <span
                  class="avatar-title rounded-circle fs-2"
                  style="background-color: #ffe1ea"
                >
                  <activity-icon
                    name="activity"
                    class="text-primary icon-md"
                  ></activity-icon>
                </span>
              </div>
            </div>
          </div>
        </BCardBody>
      </BCard>
    </BCol>
    <BCol md="6">
      <BCard no-body class="card-animate">
        <BCardBody>
          <div class="d-flex justify-content-between">
            <div>
              <p class="fw-medium text-muted mb-0 fw-semibold h4">
                Registration
              </p>
              <h2 class="mt-4 ff-secondary fw-semibold">
                <count-to
                  :startVal="0"
                  :endVal="28.05"
                  :duration="5000"
                ></count-to
                >k
              </h2>
              <p class="mb-0 text-muted h5">
                <BBadge class="bg-light text-danger mb-0">
                  <i class="ri-arrow-down-line align-middle"></i> 16.24 %
                </BBadge>
                par rapport au evenement precedent.
              </p>
            </div>
            <div>
              <div>
                <div class="avatar-sm flex-shrink-0">
                  <span
                    class="avatar-title rounded-circle fs-2"
                    style="background-color: #ffe1ea"
                  >
                    <ClockIcon class="text-primary icon-md"></ClockIcon>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </BCardBody>
      </BCard>
    </BCol>
  </BRow>
  <BRow>
    <BCol lg="6">
      <BCard no-body>
        <BCardHeader>
          <BCardTitle class="mb-0 fw-semibold h4">Revenue</BCardTitle>
        </BCardHeader>
        <BCardBody>
          <apexchart
            class="apex-charts"
            height="350"
            dir="ltr"
            :series="basicLineChart.series"
            :options="basicLineChart.chartOptions"
          ></apexchart>
        </BCardBody>
      </BCard>
    </BCol>
    <BCol lg="6">
      <BCard no-body>
        <BCardHeader>
          <BCardTitle class="mb-0 fw-semibold h4"
            >evolutions des nombre de meetings</BCardTitle
          >
        </BCardHeader>
        <BCardBody>
          <apexchart
            class="apex-charts"
            height="350"
            dir="ltr"
            :series="basicLineChart.series"
            :options="basicLineChart.chartOptions"
          ></apexchart>
        </BCardBody>
      </BCard>
    </BCol>
  </BRow>
</template>
