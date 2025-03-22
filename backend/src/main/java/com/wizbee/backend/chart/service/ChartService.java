package com.wizbee.backend.chart.service;

import com.wizbee.backend.chart.entity.Chart;
import com.wizbee.backend.chart.repository.ChartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChartService {

    @Autowired
    ChartRepository chartRepository;

    public Chart saveChart(Chart chart){
        return chartRepository.save(chart);
    }


}
